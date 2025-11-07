import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Home, Tag, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BookingModal = ({ isOpen, onClose, room, hotelName, hotelId, hotelOwnerId }) => {
  const { user, updateUser } = useAuth();
  
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [nicOrPassport, setNicOrPassport] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  
  // Booking Details
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packagePrice, setPackagePrice] = useState(0);
  const [checkInDate, setCheckInDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [numberOfAdults, setNumberOfAdults] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  
  // Promocode
  const [promocode, setPromocode] = useState('');
  const [promocodeApplied, setPromocodeApplied] = useState(false);
  const [promocodeData, setPromocodeData] = useState(null);
  const [validatingPromocode, setValidatingPromocode] = useState(false);
  const [promocodeError, setPromocodeError] = useState('');
  
  // Calculations
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [hscRequired, setHscRequired] = useState(0);
  const [currentHscValue, setCurrentHscValue] = useState(100);
  
  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Available packages based on room data
  const availablePackages = [];
  if (room.pricePerNight > 0) {
    availablePackages.push({ name: 'Per Night', price: room.pricePerNight });
  }
  if (room.pricePerFullDay > 0) {
    availablePackages.push({ name: 'Full Day', price: room.pricePerFullDay });
  }
  if (room.pricing?.fullboardPrice > 0) {
    availablePackages.push({ name: 'Full Board', price: room.pricing.fullboardPrice });
  }
  if (room.pricing?.halfboardPrice > 0) {
    availablePackages.push({ name: 'Half Board', price: room.pricing.halfboardPrice });
  }
  
  // Fetch current HSC value
  useEffect(() => {
    const fetchHscValue = async () => {
      try {
        const response = await fetch('/api/hsc/info');
        const data = await response.json();
        setCurrentHscValue(data.hscValue || 100);
      } catch (error) {
        console.error('Error fetching HSC value:', error);
      }
    };
    fetchHscValue();
  }, []);
  
  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setEmail(user.email || '');
      setContactNumber(user.contactNumber || '');
    }
  }, [user]);
  
  // Calculate total amount
  useEffect(() => {
    if (selectedPackage && packagePrice > 0 && numberOfRooms > 0) {
      let days = numberOfDays;
      // For "Per Night" package, don't multiply by days
      if (selectedPackage === 'Per Night') {
        days = 1;
      }
      const total = packagePrice * days * numberOfRooms;
      setTotalAmount(total);
      
      // Calculate discounted amount if promocode applied
      if (promocodeApplied && room.roomOpenForAgents) {
        const discount = room.discountForPromo * numberOfRooms;
        const earnRate = room.earnRateForPromo * numberOfRooms;
        const discounted = total - discount;
        const final = discounted - earnRate;
        
        setDiscountedAmount(discounted);
        setFinalAmount(final);
        setHscRequired(earnRate / currentHscValue);
      } else {
        setDiscountedAmount(0);
        setFinalAmount(total);
        setHscRequired(0);
      }
    }
  }, [selectedPackage, packagePrice, numberOfDays, numberOfRooms, promocodeApplied, room, currentHscValue]);
  
  // Handle package selection
  const handlePackageChange = (packageName, price) => {
    setSelectedPackage(packageName);
    setPackagePrice(price);
  };
  
  // Validate promocode
  const handleApplyPromocode = async () => {
    if (!promocode.trim()) {
      setPromocodeError('Please enter a promocode');
      return;
    }
    
    setValidatingPromocode(true);
    setPromocodeError('');
    
    try {
      const response = await fetch(`/api/promocodes/validate-promocode/${promocode.toUpperCase()}`);
      const data = await response.json();
      
      if (data.success && data.isValid) {
        setPromocodeApplied(true);
        setPromocodeData(data.agent);
        setPromocodeError('');
      } else {
        setPromocodeError(data.message || 'Invalid or inactive promocode');
        setPromocodeApplied(false);
        setPromocodeData(null);
      }
    } catch (error) {
      console.error('Error validating promocode:', error);
      setPromocodeError('Failed to validate promocode');
      setPromocodeApplied(false);
      setPromocodeData(null);
    } finally {
      setValidatingPromocode(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!customerName || !nicOrPassport || !contactNumber || !email) {
      setError('Please fill in all customer details');
      return;
    }
    
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }
    
    if (!checkInDate) {
      setError('Please select check-in date');
      return;
    }
    
    const totalPersons = numberOfAdults + numberOfChildren;
    if (totalPersons > room.capacity * numberOfRooms) {
      setError(`Total persons (${totalPersons}) cannot exceed room capacity (${room.capacity * numberOfRooms})`);
      return;
    }
    
    if (numberOfRooms > room.noOfRooms) {
      setError(`Only ${room.noOfRooms} room(s) of this type available`);
      return;
    }
    
    // Check HSC balance if promocode applied
    if (promocodeApplied && hscRequired > 0) {
      if (!user || user.hscBalance < hscRequired) {
        setError(`Insufficient HSC balance. You need ${hscRequired.toFixed(2)} HSC. Your current balance: ${user?.hscBalance || 0} HSC`);
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        hotelId,
        hotelName,
        hotelOwnerId,
        roomId: room._id,
        roomName: room.roomName,
        roomType: room.type,
        customerName,
        customerNicOrPassport: nicOrPassport,
        customerContactNumber: contactNumber,
        customerEmail: email,
        selectedPackage,
        packagePrice,
        checkInDate,
        numberOfDays: selectedPackage === 'Per Night' ? 1 : numberOfDays,
        numberOfAdults,
        numberOfChildren,
        totalPersons,
        numberOfRooms,
        totalAmount,
        discountedAmount: promocodeApplied ? discountedAmount : 0,
        finalAmount: promocodeApplied ? finalAmount : totalAmount,
        promocodeUsed: promocodeApplied ? promocode.toUpperCase() : null,
        promocodeOwnerId: promocodeApplied ? promocodeData._id : null,
        discountPerRoom: promocodeApplied ? room.discountForPromo : 0,
        earnRatePerRoom: promocodeApplied ? room.earnRateForPromo : 0
      };
      
      const response = await fetch('/api/room-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update user balance if HSC was deducted
        if (data.hscDeducted && user) {
          const userResponse = await fetch('/api/users/hsc', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const userData = await userResponse.json();
          if (userData.balance !== undefined) {
            updateUser({ hscBalance: userData.balance });
          }
        }
        
        alert(`Booking request submitted successfully! Booking ID: ${data.bookingId}`);
        onClose();
      } else {
        setError(data.message || 'Failed to submit booking request');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('Failed to submit booking request');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book Room</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {room.roomName} - {room.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}
          
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  NIC or Passport *
                </label>
                <input
                  type="text"
                  value={nicOrPassport}
                  onChange={(e) => setNicOrPassport(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number *
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Select Package *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePackages.map((pkg) => (
                <button
                  key={pkg.name}
                  type="button"
                  onClick={() => handlePackageChange(pkg.name, pkg.price)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedPackage === pkg.name
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{pkg.name}</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    LKR {pkg.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              {selectedPackage !== 'Per Night' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    How Many Days *
                  </label>
                  <input
                    type="number"
                    value={numberOfDays}
                    onChange={(e) => setNumberOfDays(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Adults *
                </label>
                <input
                  type="number"
                  value={numberOfAdults}
                  onChange={(e) => setNumberOfAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Number of Children
                </label>
                <input
                  type="number"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  How Many Rooms *
                </label>
                <input
                  type="number"
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={room.noOfRooms}
                  className="input-field"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max: {room.noOfRooms} room(s) available
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Persons
                </label>
                <input
                  type="text"
                  value={numberOfAdults + numberOfChildren}
                  className="input-field bg-gray-100 dark:bg-gray-700"
                  disabled
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Max capacity: {room.capacity * numberOfRooms} person(s)
                </p>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                LKR {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Promocode Section (if room is open for agents) */}
          {room.roomOpenForAgents && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Apply Promocode (Optional)
              </h3>

              {!promocodeApplied ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promocode}
                    onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                    placeholder="Enter promocode"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromocode}
                    disabled={validatingPromocode || !promocode.trim()}
                    className="btn-primary whitespace-nowrap"
                  >
                    {validatingPromocode ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                        Promocode Applied Successfully!
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Code: {promocode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPromocodeApplied(false);
                        setPromocodeData(null);
                        setPromocode('');
                      }}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {promocodeError && (
                <p className="text-sm text-red-600 dark:text-red-400">{promocodeError}</p>
              )}

              {promocodeApplied && (
                <>
                  <div className="space-y-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount per room:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        LKR {room.discountForPromo.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total discount ({numberOfRooms} room{numberOfRooms > 1 ? 's' : ''}):</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        - LKR {(room.discountForPromo * numberOfRooms).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Discounted Amount:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        LKR {discountedAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-semibold mb-1">Important Note:</p>
                        <p>
                          If you are using a promocode and submit this booking request, you need to pay{' '}
                          <span className="font-bold">LKR {(room.earnRateForPromo * numberOfRooms).toLocaleString()}</span>{' '}
                          (Earn Rate for Agent) from your HSC balance. This amount will also be deducted from your room value.
                          If the hotel rejects your request, this amount will be refunded to your HSC balance immediately.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Agent earn rate ({numberOfRooms} room{numberOfRooms > 1 ? 's' : ''}):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        LKR {(room.earnRateForPromo * numberOfRooms).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
                      <span className="font-semibold text-gray-900 dark:text-white">Final Amount to Pay:</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        LKR {finalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-800 dark:text-orange-200">
                        HSC Required to Pay:
                      </span>
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {hscRequired.toFixed(2)} HSC
                      </span>
                    </div>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      Your current balance: {user?.hscBalance || 0} HSC
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : promocodeApplied ? (
              `Pay ${hscRequired.toFixed(2)} HSC & Confirm Request`
            ) : (
              'Confirm Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

