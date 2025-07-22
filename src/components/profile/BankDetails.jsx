import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../config/api';
import {
  Building2,
  CreditCard,
  MapPin,
  User,
  Save,
  X,
  Edit3,
  Loader,
  CheckCircle,
  AlertCircle,
  Shield,
  Info
} from 'lucide-react';

// Sri Lankan Banks List
const sriLankanBanks = [
  'Bank of Ceylon',
  'People\'s Bank',
  'Commercial Bank of Ceylon PLC',
  'Hatton National Bank PLC',
  'Sampath Bank PLC',
  'Nations Trust Bank PLC',
  'DFCC Bank PLC',
  'National Development Bank PLC',
  'Seylan Bank PLC',
  'Union Bank of Colombo PLC',
  'Pan Asia Banking Corporation PLC',
  'Regional Development Bank',
  'Sanasa Development Bank PLC',
  'HDFC Bank'
];

const BankDetails = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle navigation state message
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const [bankDetails, setBankDetails] = useState({
    bank: user?.bankDetails?.bank || '',
    branch: user?.bankDetails?.branch || '',
    accountNo: user?.bankDetails?.accountNo || '',
    accountName: user?.bankDetails?.accountName || '',
    postalCode: user?.bankDetails?.postalCode || '',
    binanceId: user?.bankDetails?.binanceId || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateBankDetails = () => {
    const { bank, branch, accountNo, accountName, postalCode, binanceId } = bankDetails;

    // Check if any bank field is filled (excluding binanceId)
    const bankFieldsFilled = [bank, branch, accountNo, accountName, postalCode].some(field => field && field.trim());

    // Check if only binanceId is filled
    const onlyBinanceIdFilled = binanceId && binanceId.trim() && !bankFieldsFilled;

    // If only binanceId is filled, allow it (no validation error)
    if (onlyBinanceIdFilled) {
      return null;
    }

    // If any bank field is filled, all must be filled
    if (bankFieldsFilled) {
      const requiredFields = [
        { field: bank, name: 'Bank' },
        { field: branch, name: 'Branch' },
        { field: accountNo, name: 'Account Number' },
        { field: accountName, name: 'Account Name' },
        { field: postalCode, name: 'Postal Code' }
      ];

      const missingFields = requiredFields.filter(({ field }) => !field || !field.trim());

      if (missingFields.length > 0) {
        const fieldNames = missingFields.map(({ name }) => name).join(', ');
        return `Please fill all bank details: ${fieldNames}`;
      }
    }

    // Check if no fields are filled at all
    const allFieldsEmpty = !bankFieldsFilled && (!binanceId || !binanceId.trim());
    if (allFieldsEmpty) {
      return 'Please fill either complete bank details or Binance ID';
    }

    return null; // No validation errors
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate bank details
      const validationError = validateBankDetails();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      const response = await userAPI.updateProfile({ bankDetails });

      if (response.data.user) {
        updateUser(response.data.user);
        setIsEditing(false);
        setSuccess('Bank details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);

        // If user came from claim process, navigate back
        if (location.state?.returnTo) {
          setTimeout(() => {
            navigate(location.state.returnTo);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error updating bank details:', error);
      setError(error.response?.data?.message || 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBankDetails({
      bank: user?.bankDetails?.bank || '',
      branch: user?.bankDetails?.branch || '',
      accountNo: user?.bankDetails?.accountNo || '',
      accountName: user?.bankDetails?.accountName || '',
      postalCode: user?.bankDetails?.postalCode || '',
      binanceId: user?.bankDetails?.binanceId || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bank Details
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Manage your banking information for payments and transactions
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm sm:text-base text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm sm:text-base text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Bank Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Banking Information
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Secure storage of your payment details
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 px-5 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base font-semibold w-full sm:w-auto shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Details</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bank (Sri Lanka) <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <select
                name="bank"
                value={bankDetails.bank}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              >
                <option value="">Select a bank</option>
                {sriLankanBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base break-words font-medium">
                  {bankDetails.bank || <span className="text-gray-500 italic">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Branch <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="branch"
                value={bankDetails.branch}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Enter branch name"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base break-words font-medium">
                  {bankDetails.branch || <span className="text-gray-500 italic">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="accountNo"
                value={bankDetails.accountNo}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Enter account number"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                <CreditCard className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base font-mono font-medium">
                  {bankDetails.accountNo ? `****${bankDetails.accountNo.slice(-4)}` : <span className="text-gray-500 italic font-sans">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Account Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="accountName"
                value={bankDetails.accountName}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                placeholder={`Enter account holder name (e.g., ${user?.name || 'Your Name'})`}
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                <User className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base break-words font-medium">
                  {bankDetails.accountName || <span className="text-gray-500 italic">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Postal Code <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="postalCode"
                value={bankDetails.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Enter postal code"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base font-medium">
                  {bankDetails.postalCode || <span className="text-gray-500 italic">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Binance ID (Alternative) */}
          <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-4 sm:pt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Binance ID <span className="text-xs font-normal text-gray-500">(Alternative for Foreign Transactions)</span>
            </label>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border border-blue-200 dark:border-blue-800">
              💡 You can provide your Binance ID as an independent alternative to bank details
            </p>
            {isEditing ? (
              <input
                type="text"
                name="binanceId"
                value={bankDetails.binanceId}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                placeholder="Enter Binance ID"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white text-sm sm:text-base break-all font-medium">
                  {bankDetails.binanceId || <span className="text-gray-500 italic">Not specified</span>}
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start space-x-2 mb-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm sm:text-base">
                Banking Information Guidelines
              </h4>
            </div>
            <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 space-y-2 ml-6">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                <span>All bank details must be filled together (Bank, Branch, Account Number, Account Name, Postal Code)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                <span>Account name should match your registered name</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                <span>Binance ID can be saved independently as an alternative payment method</span>
              </li>
              <li className="flex items-start space-x-2">
                <Shield className="w-3 h-3 text-green-500 flex-shrink-0 mt-1.5" />
                <span>All information is securely encrypted and stored</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
