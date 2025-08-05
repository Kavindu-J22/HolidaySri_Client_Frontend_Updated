import React, { useState } from 'react';
import { X, Upload, Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { userAPI } from '../../config/api';

const UserVerificationModal = ({ isOpen, onClose, onVerificationComplete }) => {
  const [uploadingVerification, setUploadingVerification] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [verificationError, setVerificationError] = useState('');

  if (!isOpen) return null;

  const handleVerificationUpload = async (documentType, file) => {
    if (!file) return;

    try {
      setUploadingVerification(true);
      setVerificationError('');

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'daa9e83as');

      // Upload to Cloudinary
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/daa9e83as/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      // Submit verification to backend
      const verificationResponse = await userAPI.submitUserVerification({
        documentType,
        documentUrl: data.secure_url
      });

      if (verificationResponse.data.verificationStatus === 'verified') {
        setVerificationSuccess(`${documentType} uploaded successfully! You are now verified!`);
        // Hide verification modal and refresh data after verification
        setTimeout(() => {
          setVerificationSuccess('');
          onVerificationComplete();
          onClose();
        }, 2000);
      } else {
        // Just show success message but keep verification modal open for more uploads
        let message = `${documentType} uploaded successfully! `;
        if (documentType === 'NIC_FRONT') {
          message += 'Please upload NIC back side to complete verification.';
        } else if (documentType === 'NIC_BACK') {
          message += 'Please upload NIC front side to complete verification.';
        } else {
          message += 'Verification is pending review.';
        }
        setVerificationSuccess(message);
        setTimeout(() => setVerificationSuccess(''), 3000);
      }

    } catch (error) {
      console.error('Verification upload error:', error);
      setVerificationError('Failed to upload verification document. Please try again.');
    } finally {
      setUploadingVerification(false);
    }
  };

  const handleFileSelect = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      handleVerificationUpload(documentType, file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Identity Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload your identification documents to get verified. You can upload either:
            </p>
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
              <li>Both sides of your National Identity Card (NIC), or</li>
              <li>Your Passport</li>
            </ul>
          </div>

          {/* Success Message */}
          {verificationSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-800 dark:text-green-200 text-sm">
                  {verificationSuccess}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-800 dark:text-red-200 text-sm">
                  {verificationError}
                </span>
              </div>
            </div>
          )}

          {/* Upload Options */}
          <div className="space-y-4">
            {/* NIC Front */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                National Identity Card (Front)
              </h3>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('NIC_FRONT', e)}
                  disabled={uploadingVerification}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  {uploadingVerification ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload NIC front
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* NIC Back */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                National Identity Card (Back)
              </h3>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('NIC_BACK', e)}
                  disabled={uploadingVerification}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  {uploadingVerification ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload NIC back
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Passport */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Passport (Alternative)
              </h3>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('PASSPORT', e)}
                  disabled={uploadingVerification}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  {uploadingVerification ? (
                    <div className="flex items-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Uploading...</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload passport
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Note:</strong> Your documents are securely uploaded and will be reviewed for verification. 
              This process helps ensure the authenticity of advertisements on our platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVerificationModal;
