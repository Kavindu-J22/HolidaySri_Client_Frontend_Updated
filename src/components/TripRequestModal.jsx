import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { tripRequestAPI } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

const TripRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState(50);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    destinations: [''],
    startLocation: { name: '', mapLink: '' },
    endLocation: { name: '', mapLink: '' },
    description: '',
    days: '',
    requiredBuddies: '',
    budgetPerPerson: '',
    wishToExplore: [''],
    activities: [''],
    startDate: '',
    endDate: '',
    accommodation: '',
    transport: '',
    whatsappGroupLink: '',
    organizerWhatsapp: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCharge();
    }
  }, [isOpen]);

  const fetchCharge = async () => {
    try {
      const response = await tripRequestAPI.getCharge();
      setCharge(response.data.data.charge);
    } catch (error) {
      console.error('Error fetching charge:', error);
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleLocationChange = (locationType, field, value) => {
    setFormData({
      ...formData,
      [locationType]: { ...formData[locationType], [field]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to confirm this? You can't edit your Trip Request again. Please check again and confirm it."
    );
    
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        destinations: formData.destinations.filter(d => d.trim() !== ''),
        wishToExplore: formData.wishToExplore.filter(w => w.trim() !== ''),
        activities: formData.activities.filter(a => a.trim() !== ''),
        days: parseInt(formData.days),
        requiredBuddies: parseInt(formData.requiredBuddies),
        budgetPerPerson: parseFloat(formData.budgetPerPerson)
      };

      await tripRequestAPI.createTripRequest(cleanedData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setFormData({
        destinations: [''],
        startLocation: { name: '', mapLink: '' },
        endLocation: { name: '', mapLink: '' },
        description: '',
        days: '',
        requiredBuddies: '',
        budgetPerPerson: '',
        wishToExplore: [''],
        activities: [''],
        startDate: '',
        endDate: '',
        accommodation: '',
        transport: '',
        whatsappGroupLink: '',
        organizerWhatsapp: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating trip request:', error);
      setError(error.response?.data?.message || 'Failed to create trip request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add Trip Request
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Charge: {charge} HSC | Your Balance: {user?.hscBalance || 0} HSC
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Destinations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destinations *
            </label>
            {formData.destinations.map((dest, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={dest}
                  onChange={(e) => handleArrayFieldChange('destinations', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Kandy"
                  required
                />
                {formData.destinations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('destinations', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('destinations')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Destination
            </button>
          </div>

          {/* Start Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Location Name *
              </label>
              <input
                type="text"
                value={formData.startLocation.name}
                onChange={(e) => handleLocationChange('startLocation', 'name', e.target.value)}
                className="input-field"
                placeholder="e.g., Colombo Airport"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Location Map Link *
              </label>
              <input
                type="url"
                value={formData.startLocation.mapLink}
                onChange={(e) => handleLocationChange('startLocation', 'mapLink', e.target.value)}
                className="input-field"
                placeholder="https://maps.google.com/..."
                required
              />
            </div>
          </div>

          {/* End Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Location Name *
              </label>
              <input
                type="text"
                value={formData.endLocation.name}
                onChange={(e) => handleLocationChange('endLocation', 'name', e.target.value)}
                className="input-field"
                placeholder="e.g., Colombo Airport"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Location Map Link *
              </label>
              <input
                type="url"
                value={formData.endLocation.mapLink}
                onChange={(e) => handleLocationChange('endLocation', 'mapLink', e.target.value)}
                className="input-field"
                placeholder="https://maps.google.com/..."
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="4"
              placeholder="Describe your trip plan..."
              required
            />
          </div>

          {/* Days, Required Buddies, Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Days *
              </label>
              <input
                type="number"
                min="1"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                className="input-field"
                placeholder="7"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Buddies *
              </label>
              <input
                type="number"
                min="1"
                value={formData.requiredBuddies}
                onChange={(e) => setFormData({ ...formData, requiredBuddies: e.target.value })}
                className="input-field"
                placeholder="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget Per Person (LKR) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.budgetPerPerson}
                onChange={(e) => setFormData({ ...formData, budgetPerPerson: e.target.value })}
                className="input-field"
                placeholder="50000"
                required
              />
            </div>
          </div>

          {/* Wish to Explore */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Wish to Explore (Optional)
            </label>
            {formData.wishToExplore.map((wish, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={wish}
                  onChange={(e) => handleArrayFieldChange('wishToExplore', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Ancient temples"
                />
                {formData.wishToExplore.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('wishToExplore', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('wishToExplore')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Item
            </button>
          </div>

          {/* Activities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Activities *
            </label>
            {formData.activities.map((activity, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleArrayFieldChange('activities', index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Hiking"
                  required
                />
                {formData.activities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('activities', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('activities')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Activity
            </button>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Accommodation & Transport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Accommodation *
              </label>
              <input
                type="text"
                value={formData.accommodation}
                onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                className="input-field"
                placeholder="e.g., Mix of hostels and boutique hotels"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transport *
              </label>
              <input
                type="text"
                value={formData.transport}
                onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                className="input-field"
                placeholder="e.g., Scooters and private drivers"
                required
              />
            </div>
          </div>

          {/* WhatsApp Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Organizer's WhatsApp Number *
              </label>
              <input
                type="tel"
                value={formData.organizerWhatsapp}
                onChange={(e) => setFormData({ ...formData, organizerWhatsapp: e.target.value })}
                className="input-field"
                placeholder="+94771234567"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WhatsApp Group Link (Optional)
              </label>
              <input
                type="url"
                value={formData.whatsappGroupLink}
                onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
                className="input-field"
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (user?.hscBalance || 0) < charge}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Submit Request ({charge} HSC)</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripRequestModal;

