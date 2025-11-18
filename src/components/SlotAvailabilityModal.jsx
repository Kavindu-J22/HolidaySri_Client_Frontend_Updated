import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Loader, Bell, Clock, Grid3x3 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const SlotAvailabilityModal = ({ isOpen, onClose }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNotificationRequest, setHasNotificationRequest] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSlotAvailability();
      checkNotificationStatus();
    }
  }, [isOpen]);

  const fetchSlotAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/home-banner-slot/slots/availability`);
      const data = await response.json();

      if (data.success) {
        setSlots(data.data);
      }
    } catch (error) {
      console.error('Error fetching slot availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/home-banner-slot/my-notification`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setHasNotificationRequest(true);
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  };

  const handleNotifyMe = async () => {
    setNotifyLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to use this feature');
        return;
      }

      const userEmail = JSON.parse(atob(token.split('.')[1])).email;

      const response = await fetch(`${API_BASE_URL}/home-banner-slot/notify-me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();

      if (data.success) {
        setHasNotificationRequest(true);
        setShowNotifyModal(true);
        setTimeout(() => setShowNotifyModal(false), 3000);
      } else {
        alert(data.message || 'Failed to register notification');
      }
    } catch (error) {
      console.error('Error registering notification:', error);
      alert('Failed to register notification');
    } finally {
      setNotifyLoading(false);
    }
  };

  if (!isOpen) return null;

  const allSlotsOccupied = slots.every(slot => !slot.isAvailable);

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Grid3x3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Home Banner Slot Availability
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check real-time availability of all 6 banner slots
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-12 h-12 animate-spin text-purple-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading slot availability...</p>
              </div>
            ) : (
              <>
                {/* Slots Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {slots.map((slot) => {
                    const isAvailable = slot.isAvailable;

                    return (
                      <div
                        key={slot.slotNumber}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          isAvailable
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Slot {slot.slotNumber}
                          </span>
                          {isAvailable ? (
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            isAvailable
                              ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                          }`}>
                            {isAvailable ? 'Available' : 'Occupied'}
                          </div>

                          {!isAvailable && slot.expiresAt && (
                            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                              <div className="flex items-start space-x-2">
                                <Clock className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-red-700 dark:text-red-300 font-medium mb-1">
                                    Available After:
                                  </p>
                                  <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                                    {new Date(slot.expiresAt).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">Available Slots</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {slots.filter(s => s.isAvailable).length}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300 mb-1">Occupied Slots</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {slots.filter(s => !s.isAvailable).length}
                    </p>
                  </div>
                </div>

                {/* Notify Me Section - Only show if all slots occupied */}
                {allSlotsOccupied && (
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
                          All Slots Currently Occupied
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                          Don't miss out! Get notified via email when a slot becomes available. We check hourly and will inform you immediately.
                        </p>
                        
                        {!hasNotificationRequest ? (
                          <button
                            onClick={handleNotifyMe}
                            disabled={notifyLoading}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            {notifyLoading ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>Registering...</span>
                              </>
                            ) : (
                              <>
                                <Bell className="w-5 h-5" />
                                <span>Notify Me When Available</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="flex items-center justify-center space-x-2 p-3 bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-semibold text-green-700 dark:text-green-300">
                              You'll be notified when a slot is available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Message */}
                {!allSlotsOccupied && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
                      <span className="font-semibold">Ready to advertise?</span> Purchase a Home Banner Advertisement Slot and select an available slot to get started!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Notification Success Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Notification Registered!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We'll notify you via email when a slot becomes available.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SlotAvailabilityModal;

