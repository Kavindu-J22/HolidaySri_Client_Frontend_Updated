import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import Loader from './components/common/LoadingScreen';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Download from './pages/Download';
import Profile from './pages/Profile';
import HSCWallet from './pages/HSCWallet';
import HSCTreasure from './pages/HSCTreasure';
import ClaimEarnings from './pages/ClaimEarnings';
import PromoCodesAndTravelAgents from './pages/PromoCodesAndTravelAgents';
import GeneratePromoCode from './pages/GeneratePromoCode';
import PromoCodePayment from './pages/PromoCodePayment';
import RenewPromoCode from './pages/RenewPromoCode';
import Notifications from './pages/Notifications';
import PayHerePayment from './pages/PayHerePayment';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import HSGPopup from './components/common/HSGPopup';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // You can add actual initialization logic here
      // For example: loading user preferences, checking auth state, etc.

      // Loading time for better UX (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <Loader />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <HSGPopup />
          <div className="App">
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Main app routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="services" element={<Services />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="download" element={<Download />} />

                {/* Protected routes */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="hsc" element={
                  <ProtectedRoute>
                    <HSCWallet />
                  </ProtectedRoute>
                } />
                <Route path="claim-earnings" element={
                  <ProtectedRoute>
                    <ClaimEarnings />
                  </ProtectedRoute>
                } />
                <Route path="hsc-treasure" element={<HSCTreasure />} />
                <Route path="promo-codes-travel-agents" element={<PromoCodesAndTravelAgents />} />
                <Route path="generate-promo-code" element={
                  <ProtectedRoute>
                    <GeneratePromoCode />
                  </ProtectedRoute>
                } />
                <Route path="promo-code-payment" element={
                  <ProtectedRoute>
                    <PromoCodePayment />
                  </ProtectedRoute>
                } />
                <Route path="renew-promo-code" element={
                  <ProtectedRoute>
                    <RenewPromoCode />
                  </ProtectedRoute>
                } />
                <Route path="notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                <Route path="payment/payhere" element={
                  <ProtectedRoute>
                    <PayHerePayment />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
