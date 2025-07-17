import React from 'react';
import { Check, X } from 'lucide-react';
import { checkPasswordStrength, getPasswordRequirements } from '../../utils/passwordStrength';

const PasswordStrength = ({ password, showRequirements = true }) => {
  const strength = checkPasswordStrength(password);
  const requirements = getPasswordRequirements();

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Strength
          </span>
          <span className={`text-sm font-semibold ${strength.color}`}>
            {strength.strength}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.bgColor}`}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
        
        {/* Strength Dots */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                level <= strength.score
                  ? strength.bgColor
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Requirements:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {requirements.map((req) => {
              const isMet = strength.requirements[req.key];
              return (
                <div
                  key={req.key}
                  className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                    isMet
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                    isMet
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {isMet ? (
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <X className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                  <span className="flex items-center space-x-1">
                    <span>{req.icon}</span>
                    <span>{req.text}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security Tips */}
      {strength.score >= 4 && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              Great! Your password is strong and secure.
            </p>
          </div>
        </div>
      )}

      {strength.score < 3 && password.length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Consider making your password stronger for better security.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;
