/**
 * Convert 24-hour time format to 12-hour AM/PM format
 * @param {string} time - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns {string} Time in 12-hour format with AM/PM (e.g., "2:30 PM", "9:00 AM")
 */
export const formatTimeTo12Hour = (time) => {
  if (!time) return '';
  
  // Handle if time already has AM/PM
  if (time.includes('AM') || time.includes('PM') || time.includes('am') || time.includes('pm')) {
    return time;
  }
  
  // Split time into hours and minutes
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = minutes || '00';
  
  // Determine AM/PM
  const period = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${hour12}:${minute} ${period}`;
};

/**
 * Format operating hours range
 * @param {string} openTime - Opening time
 * @param {string} closeTime - Closing time
 * @returns {string} Formatted time range (e.g., "9:00 AM - 10:00 PM")
 */
export const formatOperatingHours = (openTime, closeTime) => {
  if (!openTime || !closeTime) return '';
  
  const formattedOpen = formatTimeTo12Hour(openTime);
  const formattedClose = formatTimeTo12Hour(closeTime);
  
  return `${formattedOpen} - ${formattedClose}`;
};

