import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import SuccessModal from '../components/common/SuccessModal';

const provincesAndDistricts = {
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota'],
  'Northern Province': ['Jaffna', 'Mullaitivu', 'Vavuniya'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western Province': ['Kurunegala', 'Puttalam'],
  'North Central Province': ['Polonnaruwa', 'Anuradhapura'],
  'Uva Province': ['Badulla', 'Monaragala'],
  'Sabaragamuwa Province': ['Ratnapura', 'Kegalle']
};

const specializations = ['Organic & Handpicked', 'Certified Organic', 'Fair Trade', 'Premium Selection', 'Bulk Wholesale'];
const categories = ['Spices', 'Herbs', 'Tea & Infusions', 'Dried Fruits', 'Seeds & Nuts', 'Powders & Blends'];
const paymentMethodsOptions = ['cash', 'card', 'koko', 'bank_transfer', 'online_payment'];

export default function EditOrganicHerbalProductsSpicesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    category: '',
    description: '',
    price: '',
    province: '',
    city: '',
    paymentMethods: [],
    deliveryAvailable: false,
    contact: { phone: '', email: '', facebook: '', whatsapp: '' },
    website: '',
    available: true,
    images: []
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/organic-herbal-products-spices/${id}`);
        const result = await response.json();

        if (result.success) {
          const product = result.data;
          setFormData({
            name: product.name,
            specialization: product.specialization,
            category: product.category,
            description: product.description,
            price: product.price,
            province: product.location.province,
            city: product.location.city,
            paymentMethods: product.paymentMethods,
            deliveryAvailable: product.deliveryAvailable,
            contact: product.contact,
            website: product.website || '',
            available: product.available,
            images: product.images || []
          });
          setUploadedImages(product.images || []);
          setCities(provincesAndDistricts[product.location.province] || []);
        }
      } catch (err) {
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData({ ...formData, province, city: '' });
    setCities(provincesAndDistricts[province] || []);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 3) {
      setError('Maximum 3 images allowed');
      return;
    }

    setUploading(true);
    try {
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('upload_preset', 'ml_default');

        const response = await fetch('https://api.cloudinary.com/v1_1/daa9e83as/image/upload', {
          method: 'POST',
          body: formDataUpload
        });

        const data = await response.json();
        if (data.secure_url) {
          setUploadedImages([...uploadedImages, {
            url: data.secure_url,
            publicId: data.public_id,
            alt: formData.name
          }]);
        }
      }
    } catch (err) {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.specialization || !formData.category || 
        !formData.description || !formData.price || !formData.province || 
        !formData.city || !formData.contact.phone || !formData.contact.email) {
      setError('All required fields must be filled');
      return;
    }

    if (uploadedImages.length === 0) {
      setError('At least 1 image is required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/organic-herbal-products-spices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: uploadedImages
        })
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/my-advertisements'), 2000);
      } else {
        setError(result.message || 'Update failed');
      }
    } catch (err) {
      setError('Error updating product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Edit Product
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg`}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">Select Specialization</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="Price (LKR)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.province}
              onChange={handleProvinceChange}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">Select Province</option>
              {Object.keys(provincesAndDistricts).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Payment Methods */}
          <div>
            <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Payment Methods
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {paymentMethodsOptions.map(method => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.paymentMethods.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, paymentMethods: [...formData.paymentMethods, method] });
                      } else {
                        setFormData({ ...formData, paymentMethods: formData.paymentMethods.filter(m => m !== method) });
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.deliveryAvailable}
                onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                className="w-4 h-4"
              />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Delivery Available</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4"
              />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Available</span>
            </label>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone"
              value={formData.contact.phone}
              onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.contact.email}
              onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <input
              type="url"
              placeholder="Facebook (optional)"
              value={formData.contact.facebook}
              onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, facebook: e.target.value } })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
            <input
              type="tel"
              placeholder="WhatsApp (optional)"
              value={formData.contact.whatsapp}
              onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, whatsapp: e.target.value } })}
              className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>

          <input
            type="url"
            placeholder="Website (optional)"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
          />

          {/* Images */}
          <div>
            <label className={`block mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Product Images (Max 3)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDarkMode ? 'border-gray-600 hover:border-blue-500' : 'border-gray-300 hover:border-blue-500'}`}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading || uploadedImages.length >= 3}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-2" size={32} />
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Click to upload images</p>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>

      {success && <SuccessModal message="Product updated successfully!" />}
    </div>
  );
}

