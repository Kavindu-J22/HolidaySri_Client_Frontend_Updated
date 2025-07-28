import React, { useState, useEffect } from 'react';

const FilterPanel = ({ filters, onChange }) => {
  const [options, setOptions] = useState({
    types: [],
    climates: [],
    provincesAndDistricts: {}
  });

  const destinationTypes = ['Famous', 'Popular', 'Hidden', 'Adventure', 'Cultural', 'Beach', 'Mountain', 'Historical', 'Wildlife', 'Religious'];
  const climateOptions = [
    'Dry zone',
    'Intermediate zone',
    'Montane zone',
    'Semi-Arid zone',
    'Oceanic zone',
    'Tropical Wet zone',
    'Tropical Submontane',
    'Tropical Dry Zone',
    'Tropical Monsoon Climate',
    'Tropical Savanna Climate'
  ];

  const provincesAndDistricts = {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mannar", "Vavuniya", "Kilinochchi", "Mullaitivu"],
    "Eastern Province": ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Anuradhapura", "Polonnaruwa"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Kegalle", "Ratnapura"]
  };

  useEffect(() => {
    setOptions({
      types: destinationTypes,
      climates: climateOptions,
      provincesAndDistricts
    });
  }, []);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === 'province') {
      newFilters.province = value;
      newFilters.district = ''; // Reset district when province changes
    } else {
      newFilters[filterType] = value;
    }
    
    onChange(newFilters);
  };

  const clearFilter = (filterType) => {
    const newFilters = { ...filters };
    if (filterType === 'province') {
      newFilters.province = '';
      newFilters.district = '';
    } else {
      newFilters[filterType] = '';
    }
    onChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Filter Destinations
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Destination Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Destination Type
          </label>
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input w-full appearance-none"
            >
              <option value="">All Types</option>
              {options.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {filters.type && (
              <button
                onClick={() => clearFilter('type')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Climate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Climate
          </label>
          <div className="relative">
            <select
              value={filters.climate}
              onChange={(e) => handleFilterChange('climate', e.target.value)}
              className="input w-full appearance-none"
            >
              <option value="">All Climates</option>
              {options.climates.map(climate => (
                <option key={climate} value={climate}>{climate}</option>
              ))}
            </select>
            {filters.climate && (
              <button
                onClick={() => clearFilter('climate')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Province
          </label>
          <div className="relative">
            <select
              value={filters.province}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="input w-full appearance-none"
            >
              <option value="">All Provinces</option>
              {Object.keys(options.provincesAndDistricts).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {filters.province && (
              <button
                onClick={() => clearFilter('province')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            District
          </label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="input w-full appearance-none"
              disabled={!filters.province}
            >
              <option value="">All Districts</option>
              {filters.province && options.provincesAndDistricts[filters.province]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {filters.district && (
              <button
                onClick={() => clearFilter('district')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Clear filter"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.type || filters.climate || filters.province || filters.district) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          
          {filters.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Type: {filters.type}
              <button
                onClick={() => clearFilter('type')}
                className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.climate && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Climate: {filters.climate}
              <button
                onClick={() => clearFilter('climate')}
                className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.province && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              Province: {filters.province}
              <button
                onClick={() => clearFilter('province')}
                className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.district && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              District: {filters.district}
              <button
                onClick={() => clearFilter('district')}
                className="ml-1 text-orange-600 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-100"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
