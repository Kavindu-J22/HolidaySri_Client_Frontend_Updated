import React from 'react';
import { X, MapPin, Thermometer, Building, Navigation } from 'lucide-react';

const LocationFilterPanel = ({ 
  filters, 
  onFilterChange, 
  locationTypes, 
  climateOptions, 
  provincesAndDistricts, 
  destinations,
  stats 
}) => {
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset district when province changes
    if (key === 'province') {
      newFilters.district = '';
    }
    
    onFilterChange(newFilters);
  };

  const clearFilter = (key) => {
    handleFilterChange(key, '');
  };

  const clearAllFilters = () => {
    onFilterChange({
      locationType: '',
      climate: '',
      province: '',
      district: '',
      mainDestination: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter);
  const availableDistricts = filters.province ? provincesAndDistricts[filters.province] || [] : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Location Type */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Location Type
            </label>
            {filters.locationType && (
              <button
                onClick={() => clearFilter('locationType')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filters.locationType}
            onChange={(e) => handleFilterChange('locationType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All Types</option>
            {locationTypes.map(type => (
              <option key={type} value={type}>
                {type} {stats.byType[type] ? `(${stats.byType[type]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Climate */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Thermometer className="w-4 h-4 mr-2" />
              Climate
            </label>
            {filters.climate && (
              <button
                onClick={() => clearFilter('climate')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filters.climate}
            onChange={(e) => handleFilterChange('climate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All Climates</option>
            {climateOptions.map(climate => (
              <option key={climate} value={climate}>
                {climate} {stats.byClimate[climate] ? `(${stats.byClimate[climate]})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Province
            </label>
            {filters.province && (
              <button
                onClick={() => clearFilter('province')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filters.province}
            onChange={(e) => handleFilterChange('province', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All Provinces</option>
            {Object.keys(provincesAndDistricts).map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <Navigation className="w-4 h-4 mr-2" />
              District
            </label>
            {filters.district && (
              <button
                onClick={() => clearFilter('district')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            disabled={!filters.province}
          >
            <option value="">All Districts</option>
            {availableDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Main Destination */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Main Destination
            </label>
            {filters.mainDestination && (
              <button
                onClick={() => clearFilter('mainDestination')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <select
            value={filters.mainDestination}
            onChange={(e) => handleFilterChange('mainDestination', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All Destinations</option>
            {destinations.map(destination => (
              <option key={destination._id} value={destination._id}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Active Filters
          </h4>
          <div className="space-y-2">
            {filters.locationType && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white mr-2">{filters.locationType}</span>
                  <button
                    onClick={() => clearFilter('locationType')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            {filters.climate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Climate:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white mr-2">{filters.climate}</span>
                  <button
                    onClick={() => clearFilter('climate')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            {filters.province && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Province:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white mr-2">{filters.province}</span>
                  <button
                    onClick={() => clearFilter('province')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            {filters.district && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">District:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white mr-2">{filters.district}</span>
                  <button
                    onClick={() => clearFilter('district')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            {filters.mainDestination && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white mr-2">
                    {destinations.find(d => d._id === filters.mainDestination)?.name || 'Unknown'}
                  </span>
                  <button
                    onClick={() => clearFilter('mainDestination')}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFilterPanel;
