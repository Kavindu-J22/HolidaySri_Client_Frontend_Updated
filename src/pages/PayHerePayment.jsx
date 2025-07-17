import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, hscAPI } from '../config/api';

const PayHerePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get payment data from navigation state
  const paymentData = location.state;

  // PayHere configuration
  const merchantId = '234525';
  const returnUrl = window.location.origin + '/hsc-treasure';
  const cancelUrl = window.location.origin + '/hsc-treasure';
  const notifyUrl = 'https://holidaysri-backend.onrender.com/payhere/notify'; // need to modfy i think
  const merchantSecret = 'Mzg0NzkxNDMzMDM0OTIxODQyMzA1NDAyNzUzMzMyNDg1NTEwNzY=';

  useEffect(() => {
    // Redirect if no payment data
    if (!paymentData) {
      navigate('/hsc-treasure');
      return;
    }

    // Generate unique order ID
    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `HSC_${timestamp}_${randomString}`;
    };
    setOrderId(generateOrderId());

    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }

    // Load PayHere script
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.payhere.onCompleted = async function onCompleted(orderId) {
        console.log('Payment completed. OrderID:', orderId);
        setLoading(true);

        try {
          // Handle successful payment based on type
          if (paymentData.type === 'package') {
            await handlePackagePurchaseSuccess();
          } else {
            await handleCustomPurchaseSuccess();
          }
          
          navigate('/hsc-treasure', { 
            state: { 
              status: 'PaymentSuccess', 
              orderId,
              hscAmount: paymentData.HSCamount 
            } 
          });
        } catch (error) {
          console.error('Error processing payment:', error);
          setError('Payment completed but failed to update balance. Please contact support.');
        } finally {
          setLoading(false);
        }
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log('Payment dismissed');
        navigate('/hsc-treasure');
      };

      window.payhere.onError = function onError(error) {
        console.error('Payment error:', error);
        setError('Payment failed. Please try again.');
      };
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [paymentData, user, navigate]);

  const handlePackagePurchaseSuccess = async () => {
    try {
      await hscAPI.purchasePackage({
        packageId: paymentData.packageId,
        paymentMethod: 'card',
        paymentDetails: {
          transactionId: orderId,
          paymentStatus: 'completed'
        }
      });
    } catch (error) {
      console.error('Package purchase API error:', error);
      throw error;
    }
  };

  const handleCustomPurchaseSuccess = async () => {
    try {
      await hscAPI.purchaseHSC({
        amount: paymentData.HSCamount,
        paymentMethod: 'card',
        paymentDetails: {
          transactionId: orderId,
          paymentStatus: 'completed'
        }
      });
    } catch (error) {
      console.error('Custom HSC purchase API error:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Prepare payment data for PayHere
      const paymentPayload = {
        merchant_id: merchantId,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: notifyUrl,
        order_id: orderId,
        items: paymentData.items,
        amount: paymentData.Amount.toFixed(2),
        currency: paymentData.currency,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: 'Sri Lanka'
      };

      // Generate hash for security
      const amountFormatted = parseFloat(paymentPayload.amount).toLocaleString('en-US', {
        minimumFractionDigits: 2
      }).replace(/,/g, '');

      // Create MD5 hash (simplified implementation)
      const createMD5Hash = async (text) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.substring(0, 32).toUpperCase();
      };

      const hashString = `${merchantId}${orderId}${amountFormatted}${paymentData.currency}${merchantSecret}`;
      paymentPayload.hash = await createMD5Hash(hashString);

      // Start PayHere payment
      window.payhere.startPayment(paymentPayload);
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
      console.error('Payment initiation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!paymentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/hsc-treasure')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Complete Your Purchase
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Payment Details
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Item:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {paymentData.items}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">HSC Amount:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {paymentData.HSCamount} HSC
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {paymentData.Amount.toFixed(2)} {paymentData.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Secure Payment:</strong> Your payment is processed securely through PayHere, 
                  Sri Lanka's leading payment gateway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayHerePayment;
