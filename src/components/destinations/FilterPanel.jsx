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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Destinations
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Refine your search
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Destination Type
          </label>
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200 appearance-none"
            >
              <option value="">All Types</option>
              {options.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {filters.type && (
              <button
                onClick={() => clearFilter('type')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold"
                title="Clear filter"
              >
                ×
              </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Climate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Climate
          </label>
          <div className="relative">
            <select
              value={filters.climate}
              onChange={(e) => handleFilterChange('climate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200 appearance-none"
            >
              <option value="">All Climates</option>
              {options.climates.map(climate => (
                <option key={climate} value={climate}>{climate}</option>
              ))}
            </select>
            {filters.climate && (
              <button
                onClick={() => clearFilter('climate')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold"
                title="Clear filter"
              >
                ×
              </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Province
          </label>
          <div className="relative">
            <select
              value={filters.province}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200 appearance-none"
            >
              <option value="">All Provinces</option>
              {Object.keys(options.provincesAndDistricts).map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {filters.province && (
              <button
                onClick={() => clearFilter('province')}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold"
                title="Clear filter"
              >
                ×
              </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* District */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            District
          </label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent transition-colors duration-200 appearance-none ${
                !filters.province ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold"
                title="Clear filter"
              >
                ×
              </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.type || filters.climate || filters.province || filters.district) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Filters:</span>
            <button
              onClick={() => onChange({ type: '', climate: '', province: '', district: '' })}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                Type: {filters.type}
                <button
                  onClick={() => clearFilter('type')}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 font-bold"
                >
                  ×
                </button>
              </span>
            )}

            {filters.climate && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border border-green-200 dark:border-green-800">
                Climate: {filters.climate}
                <button
                  onClick={() => clearFilter('climate')}
                  className="ml-2 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100 font-bold"
                >
                  ×
                </button>
              </span>
            )}

            {filters.province && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                Province: {filters.province}
                <button
                  onClick={() => clearFilter('province')}
                  className="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-300 dark:hover:text-purple-100 font-bold"
                >
                  ×
                </button>
              </span>
            )}

            {filters.district && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border border-orange-200 dark:border-orange-800">
                District: {filters.district}
                <button
                  onClick={() => clearFilter('district')}
                  className="ml-2 text-orange-600 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-100 font-bold"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
