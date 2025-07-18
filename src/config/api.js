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
};

// Notification API calls
export const notificationAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (notificationIds) => api.put('/notifications/mark-read', { notificationIds }),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
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
};

export default api;
