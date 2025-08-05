import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  sendOTP: (email, name) => api.post('/auth/send-otp', { email, name }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  googleAuth: (googleData) => api.post('/auth/google', googleData),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword, confirmPassword) =>
    api.post('/auth/reset-password', { token, newPassword, confirmPassword }),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  getHSCBalance: () => api.get('/users/hsc'),
  getAdvertisements: (params) => api.get('/users/advertisements', { params }),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
  getAgentDashboard: () => api.get('/users/agent-dashboard'),
  getAgentEarnings: (params) => api.get('/users/agent-earnings', { params }),
  submitAgentVerification: (verificationData) => api.post('/users/agent-verification', verificationData),
  getAgentVerificationStatus: () => api.get('/users/agent-verification-status'),
  toggleAgentStatus: () => api.put('/users/agent-toggle-status'),
  upgradeAgentTier: () => api.put('/users/agent-upgrade-tier'),
  renewPromoCode: (renewalData) => api.post('/users/agent-renew-promo-code', renewalData),
  getPromocodeEarnings: () => api.get('/users/promocode-earnings'),
  getBankDetailsStatus: () => api.get('/users/bank-details-status'),
  claimEarnings: (earningIds) => api.post('/users/claim-earnings', { earningIds }),
  sellPromocode: (sellingPrice, sellingDescription) => api.post('/users/sell-promocode', { sellingPrice, sellingDescription }),
  toggleSelling: () => api.post('/users/toggle-selling'),
  editSelling: (sellingPrice, sellingDescription) => api.post('/users/edit-selling', { sellingPrice, sellingDescription }),
  promotePromocode: () => api.post('/users/promote-promocode'),
  togglePromotion: () => api.post('/users/toggle-promotion'),
  getHSCEarned: () => api.get('/users/hsc-earned'),
  convertHSCEarnedToTokens: () => api.post('/users/convert-hsc-earned-to-tokens'),
  claimHSCEarned: (hscEarnedIds) => api.post('/users/claim-hsc-earned', { hscEarnedIds }),
};

// HSC API calls
export const hscAPI = {
  getInfo: () => api.get('/hsc/info'),
  purchaseHSC: (purchaseData) => api.post('/hsc/purchase', purchaseData),
  purchasePackage: (packageData) => api.post('/hsc/purchase-package', packageData),
  getTransactions: (params) => api.get('/hsc/transactions', { params }),
  spendHSC: (spendData) => api.post('/hsc/spend', spendData),
};

// Promo Code API calls
export const promoCodeAPI = {
  getConfig: () => api.get('/promocodes/config'),
  getTransactions: (params) => api.get('/promocodes/transactions', { params }),
  checkUserHasPromoCode: () => api.get('/promocodes/user-has-promocode'),
  checkUnique: (promoCode) => api.post('/promocodes/check-unique', { promoCode }),
  validatePromoCode: (promoCode) => api.post('/promocodes/validate', { promoCode }),
  processPayment: (paymentData) => api.post('/promocodes/process-payment', paymentData),
  getMarketplace: (params) => api.get('/promocodes/marketplace', { params }),
  getMarketplaceStats: () => api.get('/promocodes/marketplace/stats'),
  buyPreUsed: (agentId) => api.post('/promocodes/buy-preused', { agentId }),
  // Access control endpoints
  checkAccess: () => api.get('/promocodes/check-access'),
  payAccess: () => api.post('/promocodes/pay-access'),
  // Explore page endpoints
  getExplorePromoCodes: (params) => api.get('/promocodes/explore', { params }),
  // Favorites endpoints
  addToFavorites: (agentId, promoCode) => api.post('/promocodes/favorites/add', { agentId, promoCode }),
  removeFromFavorites: (agentId) => api.post('/promocodes/favorites/remove', { agentId }),
  getFavorites: () => api.get('/promocodes/favorites'),
};

// Notification API calls
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationIds) => api.put('/notifications/mark-read', { notificationIds }),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Newsletter API calls
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

// Advertisement Slot Charges API calls (public)
export const advertisementAPI = {
  getSlotCharges: () => api.get('/public/advertisement-slot-charges'),
  checkDuplicateSlot: (slotData) => api.post('/advertisements/check-duplicate-slot', slotData),
  calculateDiscount: (discountData) => api.post('/advertisements/calculate-discount', discountData),
  processPayment: (paymentData) => api.post('/advertisements/process-payment', paymentData),
  getMyAdvertisements: (params) => api.get('/advertisements/my-advertisements', { params }),
  pauseExpiration: (adId) => api.put(`/advertisements/pause-expiration/${adId}`),
};

// Travel Buddy API calls
export const travelBuddyAPI = {
  getCountries: () => api.get('/travel-buddy/countries'),
  publishTravelBuddy: (data) => api.post('/travel-buddy/publish', data),
};

// Admin API calls
export const adminAPI = {
  login: (username, password) => api.post('/admin/login', { username, password }),
  getDashboard: () => api.get('/admin/dashboard'),
  getHSCConfig: () => api.get('/admin/hsc-config'),
  updateHSCConfig: (configData) => api.put('/admin/hsc-config', configData),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, isActive) => api.put(`/admin/users/${userId}/status`, { isActive }),
  getHSCPackages: () => api.get('/admin/hsc-packages'),
  createHSCPackage: (packageData) => api.post('/admin/hsc-packages', packageData),
  updateHSCPackage: (packageId, packageData) => api.put(`/admin/hsc-packages/${packageId}`, packageData),
  deleteHSCPackage: (packageId) => api.delete(`/admin/hsc-packages/${packageId}`),
  getHSCEarnedClaims: (params) => api.get('/admin/hsc-earned-claims', { params }),
  approveHSCEarnedClaim: (requestId, adminNote) => api.post(`/admin/hsc-earned-claims/${requestId}/approve`, { adminNote }),
  getHSCEarnedClaimStats: () => api.get('/admin/hsc-earned-claims/stats'),
};

// Membership API calls
export const membershipAPI = {
  getConfig: () => api.get('/membership/config'),
  getStatus: () => api.get('/membership/status'),
  purchase: (membershipData) => api.post('/membership/purchase', membershipData),
  getTransactions: (params) => api.get('/membership/transactions', { params }),
};

// Commercial Partner API calls
export const commercialPartnerAPI = {
  getConfig: () => api.get('/commercial-partner/config'),
  getStatus: () => api.get('/commercial-partner/status'),
  purchase: (partnerData) => api.post('/commercial-partner/purchase', partnerData),
  getPartners: () => api.get('/commercial-partner/partners'),
  updateLogo: (logoData) => api.put('/commercial-partner/update-logo', logoData),
};

// Payment Activities API calls
export const paymentActivityAPI = {
  getActivities: (params) => api.get('/payment-activities', { params }),
  getActivityDetails: (id) => api.get(`/payment-activities/${id}`),
  getFilterOptions: () => api.get('/payment-activities/filters/options'),
};

// HSD Leader Board API calls
export const hsdLeaderBoardAPI = {
  getLeaderBoard: () => api.get('/hsd-leaderboard'),
  processPeriodEnd: () => api.post('/hsd-leaderboard/process-period-end'),
};

export default api;
