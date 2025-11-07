import React, { useState } from 'react';
import { X, Upload, Trash2, Plus, Info } from 'lucide-react';

const RoomForm = ({ formData, setFormData, onSubmit, onCancel, isEditing, uploading }) => {
  const [newAmenity, setNewAmenity] = useState('');
  const [newFullboardItem, setNewFullboardItem] = useState('');
  const [newHalfboardItem, setNewHalfboardItem] = useState('');

  const roomTypes = [
    'Single Room', 'Double Room', 'Twin Room', 'Triple Room', 'Quad Room',
    'King Room', 'Queen Room', 'Suite', 'Deluxe Room', 'Executive Room',
    'Presidential Suite', 'Family Room', 'Studio', 'Penthouse', 'Villa',
    'Bungalow', 'Cottage', 'Dormitory', 'Connecting Rooms', 'Adjoining Rooms'
  ];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > 5) {
      alert('Maximum 5 images allowed per room');
      return;
    }

    const uploadPromises = files.map(async (file) => {
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('upload_preset', 'ml_default');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
          {
            method: 'POST',
            body: formDataObj
          }
        );
        const data = await response.json();
        return {
          url: data.secure_url,
          publicId: data.public_id
        };
      } catch (error) {
        console.error('Error uploading image:', error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    const validImages = uploadedImages.filter(img => img !== null);
    
    setFormData({
      ...formData,
      images: [...formData.images, ...validImages]
    });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const addFullboardItem = () => {
    if (newFullboardItem.trim()) {
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          fullboardInclude: [...formData.pricing.fullboardInclude, newFullboardItem.trim()]
        }
      });
      setNewFullboardItem('');
    }
  };

  const removeFullboardItem = (index) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        fullboardInclude: formData.pricing.fullboardInclude.filter((_, i) => i !== index)
      }
    });
  };

  const addHalfboardItem = () => {
    if (newHalfboardItem.trim()) {
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          halfboardInclude: [...formData.pricing.halfboardInclude, newHalfboardItem.trim()]
        }
      });
      setNewHalfboardItem('');
    }
  };

  const removeHalfboardItem = (index) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        halfboardInclude: formData.pricing.halfboardInclude.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Room' : 'Add New Room'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Name *
            </label>
            <input
              type="text"
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Type</option>
              {roomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Capacity (Persons) *
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Beds *
            </label>
            <input
              type="text"
              placeholder="e.g., 1 King Bed, 2 Single Beds"
              value={formData.beds}
              onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of This Type Rooms*
            </label>
            <input
              type="number"
              min="1"
              value={formData.noOfRooms}
              onChange={(e) => setFormData({ ...formData, noOfRooms: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Room Available
              </span>
            </label>
          </div>
        </div>

        {/* Room Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Description *
          </label>
          <textarea
            value={formData.roomDescription}
            onChange={(e) => setFormData({ ...formData, roomDescription: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Per Night (LKR) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.pricePerNight}
              onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Per Full Day (LKR) *
            </label>
            <input
              type="number"
              min="0"
              value={formData.pricePerFullDay}
              onChange={(e) => setFormData({ ...formData, pricePerFullDay: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Board Pricing */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Board Options (Optional)</h4>

          {/* Full Board */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Board Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricing.fullboardPrice || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, fullboardPrice: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Board Includes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFullboardItem}
                  onChange={(e) => setNewFullboardItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFullboardItem())}
                  placeholder="e.g., Breakfast, Lunch, Dinner"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addFullboardItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.pricing.fullboardInclude.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeFullboardItem(index)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Half Board */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Half Board Price (LKR)
              </label>
              <input
                type="number"
                min="0"
                value={formData.pricing.halfboardPrice || 0}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, halfboardPrice: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Half Board Includes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newHalfboardItem}
                  onChange={(e) => setNewHalfboardItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHalfboardItem())}
                  placeholder="e.g., Breakfast, Dinner"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={addHalfboardItem}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.pricing.halfboardInclude.map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2">
                    {item}
                    <button type="button" onClick={() => removeHalfboardItem(index)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Amenities
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              placeholder="e.g., WiFi, Air Conditioning, TV"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={addAmenity}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-2">
                {amenity}
                <button type="button" onClick={() => removeAmenity(index)}>
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Room Images (Max 5)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Room ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.images.length < 5 && (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Agent Promotion */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Open for Holidaysri Agents
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you agree, your room will be promoted by our Holidaysri agents. You need to provide a discount price and earn rate for agents. This applies to each booking made using our agent's promo codes.
              </p>
            </div>
          </div>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.roomOpenForAgents}
              onChange={(e) => setFormData({ ...formData, roomOpenForAgents: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Yes, open this room for agent promotion
            </span>
          </label>

          {formData.roomOpenForAgents && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount for Promo (LKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discountForPromo}
                  onChange={(e) => setFormData({ ...formData, discountForPromo: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required={formData.roomOpenForAgents}
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Earn Rate for Agent (LKR) *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.earnRateForPromo}
                  onChange={(e) => setFormData({ ...formData, earnRateForPromo: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required={formData.roomOpenForAgents}
                  placeholder="e.g., 250"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : isEditing ? 'Update Room' : 'Add Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;

