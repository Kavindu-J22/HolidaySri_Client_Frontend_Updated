import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Loader, CheckCircle, FileText } from 'lucide-react';

const LocalSimMobileDataForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { advertisementId } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    experienceYears: '',
    contact: '',
    facebook: '',
    website: '',
    specialties: []
  });

  const [logo, setLogo] = useState({
    url: '',
    publicId: '',
    uploading: false
  });

  const [packagesPDF, setPackagesPDF] = useState({
    url: '',
    publicId: '',
    fileName: '',
    uploading: false
  });

  const [currentSpecialty, setCurrentSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'daa9e83as';
  const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Logo image must be less than 5MB');
      return;
    }

    setLogo(prev => ({ ...prev, uploading: true }));
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setLogo({
          url: data.secure_url,
          publicId: data.public_id,
          uploading: false
        });
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
      setLogo(prev => ({ ...prev, uploading: false }));
    }
  };

  // Handle PDF upload
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('PDF file must be less than 10MB');
      return;
    }

    setPackagesPDF(prev => ({ ...prev, uploading: true }));
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setPackagesPDF({
          url: data.secure_url,
          publicId: data.public_id,
          fileName: file.name,
          uploading: false
        });
      }
    } catch (err) {
      console.error('Error uploading PDF:', err);
      setError('Failed to upload PDF. Please try again.');
      setPackagesPDF(prev => ({ ...prev, uploading: false }));
    }
  };

  // Handle add specialty
  const handleAddSpecialty = () => {
    if (!currentSpecialty.trim()) return;

    if (formData.specialties.length >= 10) {
      setError('Maximum 10 specialties allowed');
      return;
    }

    if (formData.specialties.includes(currentSpecialty.trim())) {
      setError('This specialty is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, currentSpecialty.trim()]
    }));
    setCurrentSpecialty('');
    setError('');
  };

  // Handle remove specialty
  const handleRemoveSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.category || !formData.description || 
        !formData.experienceYears || !formData.contact || !logo.url) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.experienceYears < 0 || formData.experienceYears > 100) {
      setError('Experience years must be between 0 and 100');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/local-sim-mobile-data/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          advertisementId,
          name: formData.name,
          logo: {
            url: logo.url,
            publicId: logo.publicId
          },
          category: formData.category,
          description: formData.description,
          experienceYears: parseInt(formData.experienceYears),
          contact: formData.contact,
          packagesPDF: packagesPDF.url ? {
            url: packagesPDF.url,
            publicId: packagesPDF.publicId,
            fileName: packagesPDF.fileName
          } : undefined,
          facebook: formData.facebook || undefined,
          website: formData.website || undefined,
          specialties: formData.specialties
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to publish. Please try again.');
      }
    } catch (err) {
      console.error('Error publishing:', err);
      setError('Failed to publish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!advertisementId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No advertisement selected</p>
          <button
            onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
            className="btn-primary"
          >
            Go to My Advertisements
          </button>
        </div>
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
            Back to My Advertisements
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Publish Local SIM & Mobile Data Advertisement
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Fill in the details to publish your local SIM and mobile data service advertisement
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company Logo *</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {logo.uploading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Uploading...</span>
                </div>
              ) : logo.url ? (
                <div className="relative">
                  <img src={logo.url} alt="Logo" className="max-h-48 mx-auto rounded" />
                  <button
                    type="button"
                    onClick={() => setLogo({ url: '', publicId: '', uploading: false })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload logo (Max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company/Provider Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Dialog, Mobitel, Hutch"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g., Telecommunication, Mobile Network"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Experience Years */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Years *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="e.g., 25"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Phone or Email (any format/country)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                placeholder="Describe your services, coverage areas, and what makes you unique..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specialties</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add up to 10 specialties (e.g., 4G LTE, Broadband, Mobile Payments, International Roaming)
            </p>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentSpecialty}
                onChange={(e) => setCurrentSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                placeholder="Enter a specialty"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    <span>{specialty}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packages PDF Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Packages PDF (Optional)
            </h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {packagesPDF.uploading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Uploading...</span>
                </div>
              ) : packagesPDF.url ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{packagesPDF.fileName}</p>
                      <a
                        href={packagesPDF.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPackagesPDF({ url: '', publicId: '', fileName: '', uploading: false })}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Click to upload PDF (Max 10MB)</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePDFUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Social Media & Website (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facebook */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile', { state: { activeSection: 'advertisements' } })}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || logo.uploading || packagesPDF.uploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Publishing...
                </>
              ) : (
                'Publish Now'
              )}
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Advertisement Published Successfully!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Your Local SIM & Mobile Data advertisement has been published and is now live.
                </p>
                <div className="mt-4">
                  <div className="animate-pulse text-sm text-gray-600 dark:text-gray-400">
                    Redirecting to My Advertisements...
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalSimMobileDataForm;

