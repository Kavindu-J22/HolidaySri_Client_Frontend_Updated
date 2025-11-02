import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';

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

const servicesOptions = [
  'Meal Preparation',
  'Homework Help',
  'Bedtime Routine',
  'Playtime Activities',
  'Diaper Changing',
  'Bottle Feeding',
  'Potty Training',
  'Story Time',
  'Arts & Crafts',
  'Outdoor Activities'
];

export default function EditBabysittersChildcareForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    experience: 0,
    city: '',
    province: '',
    contact: '',
    available: false,
    includes: [],
    facebook: '',
    website: '',
    gender: 'Female',
    availability: { weekdays: '', weekends: '' },
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/babysitters-childcare/edit/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const profile = response.data.data;
        setFormData({
          name: profile.name,
          category: profile.category,
          description: profile.description,
          experience: profile.experience,
          city: profile.city,
          province: profile.province,
          contact: profile.contact,
          available: profile.available,
          includes: profile.includes || [],
          facebook: profile.facebook || '',
          website: profile.website || '',
          gender: profile.gender,
          availability: profile.availability || { weekdays: '', weekends: '' },
          images: profile.images || []
        });
        setUploadedImages(profile.images || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData(prev => ({
      ...prev,
      province,
      city: ''
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.includes(service)
        ? prev.includes.filter(s => s !== service)
        : [...prev.includes, service]
    }));
  };

  const handleAvailabilityChange = (type, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    try {
      setUploading(true);
      const newImages = [];

      for (const file of files) {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('upload_preset', 'ml_default');
        formDataObj.append('cloud_name', 'daa9e83as');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
          formDataObj
        );

        newImages.push({
          url: response.data.secure_url,
          publicId: response.data.public_id
        });
      }

      const updatedImages = [...uploadedImages, ...newImages];
      setUploadedImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
      setError('');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.category || !formData.description || 
        !formData.contact || !formData.province || !formData.city || 
        uploadedImages.length === 0) {
      setError('Please fill all required fields and upload at least one image');
      return;
    }

    try {
      setSubmitting(true);
      const response = await axios.put(
        `/api/babysitters-childcare/${id}`,
        {
          ...formData,
          images: uploadedImages
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/my-advertisements');
        }, 2000);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Babysitter Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Update your babysitter/childcare profile information
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category (e.g., Full-time Babysitter) *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>

          {/* Experience and Gender */}
          <div className="grid grid-cols-2 gap-4">
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
                max="70"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Province and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Province *
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleProvinceChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!formData.province}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                required
              >
                <option value="">Select City</option>
                {formData.province && provincesAndDistricts[formData.province].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Number *
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Services Included
            </label>
            <div className="grid grid-cols-2 gap-3">
              {servicesOptions.map(service => (
                <label key={service} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includes.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekdays Availability
              </label>
              <input
                type="text"
                placeholder="e.g., 3:00 PM - 8:00 PM"
                value={formData.availability.weekdays}
                onChange={(e) => handleAvailabilityChange('weekdays', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weekends Availability
              </label>
              <input
                type="text"
                placeholder="e.g., 8:00 AM - 8:00 PM"
                value={formData.availability.weekends}
                onChange={(e) => handleAvailabilityChange('weekends', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook Profile
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Available Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Currently Available</span>
          </label>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images (Max 4) *
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading || uploadedImages.length >= 4}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img.url}
                      alt={`Preview ${idx}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-bold disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

