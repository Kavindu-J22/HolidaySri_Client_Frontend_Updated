import React, { useState } from 'react';
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
  AlertCircle
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
  'HDFC Bank',
  'Standard Chartered Bank',
  'Citibank N.A.',
  'Deutsche Bank AG',
  'HSBC',
  'MCB Bank Limited',
  'Habib Bank Limited',
  'Indian Bank',
  'Indian Overseas Bank',
  'State Bank of India',
  'ICICI Bank Limited'
];

const BankDetails = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bankDetails, setBankDetails] = useState({
    bank: user?.bankDetails?.bank || '',
    branch: user?.bankDetails?.branch || '',
    accountNo: user?.bankDetails?.accountNo || '',
    accountName: user?.bankDetails?.accountName || user?.name || '',
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

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userAPI.updateProfile({ bankDetails });
      
      if (response.data.user) {
        updateUser(response.data.user);
        setIsEditing(false);
        setSuccess('Bank details updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
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
      accountName: user?.bankDetails?.accountName || user?.name || '',
      postalCode: user?.bankDetails?.postalCode || '',
      binanceId: user?.bankDetails?.binanceId || ''
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bank Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your banking information for payments and transactions
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-300">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span className="text-red-700 dark:text-red-300">{error}</span>
        </div>
      )}

      {/* Bank Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Banking Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure storage of your payment details
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bank
            </label>
            {isEditing ? (
              <select
                name="bank"
                value={bankDetails.bank}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a bank</option>
                {sriLankanBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.bank || 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Branch
            </label>
            {isEditing ? (
              <input
                type="text"
                name="branch"
                value={bankDetails.branch}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter branch name"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.branch || 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Number
            </label>
            {isEditing ? (
              <input
                type="text"
                name="accountNo"
                value={bankDetails.accountNo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter account number"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.accountNo ? `****${bankDetails.accountNo.slice(-4)}` : 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* Account Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="accountName"
                value={bankDetails.accountName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter account holder name"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.accountName || 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Postal Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="postalCode"
                value={bankDetails.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter postal code"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.postalCode || 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* binance Id (Alternative) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              binance ID (Alternative)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              You can provide your binance ID as an alternative to bank details
            </p>
            {isEditing ? (
              <input
                type="text"
                name="binanceId"
                value={bankDetails.binanceId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter binance ID"
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {bankDetails.binanceId || 'Not specified'}
                </span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Banking Information Guidelines
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Ensure all bank details are accurate for payment processing</li>
              <li>• Account name should match your registered name</li>
              <li>• binance ID can be used as an alternative payment method</li>
              <li>• All information is securely encrypted and stored</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
