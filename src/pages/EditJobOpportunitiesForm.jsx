import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import SuccessModal from '../components/common/SuccessModal';

const EditJobOpportunitiesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [provincesData, setProvincesData] = useState({});

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
    title: '',
    company: '',
    specialization: '',
    type: '',
    category: '',
    priority: '',
    description: '',
    salary: '',
    city: '',
    province: '',
    requirements: [],
    workType: '',
    contact: '',
    email: '',
    website: '',
    linkedin: ''
  });

  const [images, setImages] = useState({
    companyLogo: { url: '', publicId: '' },
    pdfDocument: { url: '', publicId: '' }
  });

  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    setProvincesData(provincesAndDistricts);
    fetchJobOpportunity();
  }, [id]);

  const fetchJobOpportunity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/job-opportunities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        const job = data.job;
        setFormData({
          title: job.title,
          company: job.company,
          specialization: job.specialization,
          type: job.type,
          category: job.category,
          priority: job.priority,
          description: job.description,
          salary: job.salary,
          city: job.city,
          province: job.province,
          requirements: job.requirements || [],
          workType: job.workType,
          contact: job.contact,
          email: job.email,
          website: job.website || '',
          linkedin: job.linkedin || ''
        });

        setImages({
          companyLogo: job.companyLogo || { url: '', publicId: '' },
          pdfDocument: job.pdfDocument || { url: '', publicId: '' }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job opportunity');
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'ml_default');
    formDataUpload.append('cloud_name', 'daa9e83as');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daa9e83as/${resourceType}/upload`,
        { method: 'POST', body: formDataUpload }
      );

      const data = await response.json();
      if (data.secure_url) {
        return { url: data.secure_url, publicId: data.public_id };
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData(prev => ({ ...prev, province, city: '' }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Logo must be an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Logo must be less than 5MB');
      return;
    }

    try {
      const result = await uploadToCloudinary(file, 'image');
      setImages(prev => ({ ...prev, companyLogo: result }));
      setError('');
    } catch (error) {
      setError('Failed to upload logo');
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('PDF must be less than 10MB');
      return;
    }

    try {
      const result = await uploadToCloudinary(file, 'raw');
      setImages(prev => ({ ...prev, pdfDocument: result }));
      setError('');
    } catch (error) {
      setError('Failed to upload PDF');
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.company || !formData.specialization || !formData.type ||
        !formData.category || !formData.priority || !formData.description || !formData.salary ||
        !formData.city || !formData.province || !formData.workType || !formData.contact || !formData.email) {
      setError('All required fields must be filled');
      return;
    }

    if (!images.companyLogo.url) {
      setError('Company logo is required');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/job-opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          companyLogo: images.companyLogo,
          pdfDocument: images.pdfDocument
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/profile', { state: { activeSection: 'advertisements' } });
        }, 3000);
      } else {
        setError(data.message || 'Failed to update job opportunity');
      }
    } catch (error) {
      console.error('Error updating:', error);
      setError('Failed to update job opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Job Opportunity</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Job Title *"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                name="company"
                placeholder="Company Name *"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="specialization"
                placeholder="Specialization *"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Employment Type *</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract Basis">Contract Basis</option>
                <option value="Task">Task</option>
              </select>
            </div>
          </div>

          {/* Company Logo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Company Logo</h2>
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Click to upload company logo</p>
              </div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {images.companyLogo.url && (
              <div className="mt-4 relative w-24 h-24">
                <img src={images.companyLogo.url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImages(prev => ({ ...prev, companyLogo: { url: '', publicId: '' } }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Update Job Opportunity
              </>
            )}
          </button>
        </form>

        {showSuccessModal && (
          <SuccessModal
            title="Success!"
            message="Job opportunity updated successfully!"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditJobOpportunitiesForm;

