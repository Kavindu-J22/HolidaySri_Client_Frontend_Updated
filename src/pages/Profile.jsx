import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Profile Settings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          User Information
        </h2>
        {user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
              <p className="text-gray-900 dark:text-white">{user.countryCode} {user.contactNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HSC Balance</label>
              <p className="text-gray-900 dark:text-white">{user.hscBalance || 0} HSC</p>
            </div>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 mt-6">
          Full profile management features coming soon.
        </p>
      </div>
    </div>
  );
};

export default Profile;
