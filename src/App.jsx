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
import HSCEarningsClaim from './pages/HSCEarningsClaim';
import ClaimEarnings from './pages/ClaimEarnings';
import PromoCodesAndTravelAgents from './pages/PromoCodesAndTravelAgents';
import GeneratePromoCode from './pages/GeneratePromoCode';
import PromoCodePayment from './pages/PromoCodePayment';
import RenewPromoCode from './pages/RenewPromoCode';
import PreUsedMarketplace from './pages/PreUsedMarketplace';
import ExplorePromoCodes from './pages/ExplorePromoCodes';
import FavoritePromoCodes from './pages/FavoritePromoCodes';
import Notifications from './pages/Notifications';
import PayHerePayment from './pages/PayHerePayment';
import CommercialPartnerPage from './pages/CommercialPartnerPage';
import MembershipPage from './pages/MembershipPage';
import PlanDreamTour from './pages/PlanDreamTour';
import DestinationDetail from './pages/DestinationDetail';
import Favorites from './pages/Favorites';
import ExploreLocations from './pages/ExploreLocations';
import LocationDetail from './pages/LocationDetail';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import HSGPopup from './components/common/HSGPopup';
import PostAdvertisement from './pages/PostAdvertisement';
import AdvertisementPayment from './pages/AdvertisementPayment';
import RenewAdvertisement from './pages/RenewAdvertisement';
import RenewAdvertisementPayment from './pages/RenewAdvertisementPayment';
import TransactionHistory from './pages/TransactionHistory';
import HSDLeaderBoard from './pages/HSDLeaderBoard';
import TravelBuddyForm from './pages/TravelBuddyForm';
import TravelBuddyPlatform from './pages/TravelBuddyPlatform';
import TravelBuddyDetail from './pages/TravelBuddyDetail';
import TravelBuddyFavorites from './pages/TravelBuddyFavorites';
import ManageTravelBuddyProfile from './pages/ManageTravelBuddyProfile';
import TourGuiderForm from './pages/TourGuiderForm';
import EditTourGuiderProfile from './pages/EditTourGuiderProfile';
import TourGuiderDetailView from './pages/TourGuiderDetailView';
import ExpertTourGuiders from './pages/ExpertTourGuiders';
import LocalTourPackageForm from './pages/LocalTourPackageForm';
import EditLocalTourPackage from './pages/EditLocalTourPackage';
import LocalTourPackageDetail from './pages/LocalTourPackageDetail';
import LocalTourPackagesBrowse from './pages/LocalTourPackagesBrowse';
import TravelSafeHelpProfessionalForm from './pages/TravelSafeHelpProfessionalForm';
import EditTravelSafeHelpProfessionalProfile from './pages/EditTravelSafeHelpProfessionalProfile';
import TravelSafeHelpProfessionalDetail from './pages/TravelSafeHelpProfessionalDetail';
import TravelSafeHelpProfessionalsBrowse from './pages/TravelSafeHelpProfessionalsBrowse';
import RentLandCampingParkingForm from './pages/RentLandCampingParkingForm';
import EditRentLandCampingParking from './pages/EditRentLandCampingParking';
import RentLandCampingParkingDetail from './pages/RentLandCampingParkingDetail';
import RentLandCampingParkingBrowse from './pages/RentLandCampingParkingBrowse';

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
                <Route path="transaction-history" element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                } />
                <Route path="hsd-leaderboard" element={
                  <ProtectedRoute>
                    <HSDLeaderBoard />
                  </ProtectedRoute>
                } />
                <Route path="hsc-earnings-claim" element={
                  <ProtectedRoute>
                    <HSCEarningsClaim />
                  </ProtectedRoute>
                } />
                <Route path="claim-earnings" element={
                  <ProtectedRoute>
                    <ClaimEarnings />
                  </ProtectedRoute>
                } />
                <Route path="hsc-treasure" element={<HSCTreasure />} />
                <Route path="promo-codes-travel-agents" element={<PromoCodesAndTravelAgents />} />
                <Route path="pre-used-promo-codes-marketplace" element={<PreUsedMarketplace />} />
                <Route path="explore-promo-codes" element={
                  <ProtectedRoute>
                    <ExplorePromoCodes />
                  </ProtectedRoute>
                } />
                <Route path="favorite-promo-codes" element={
                  <ProtectedRoute>
                    <FavoritePromoCodes />
                  </ProtectedRoute>
                } />
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
                <Route path="plan-dream-tour" element={<PlanDreamTour />} />
                <Route path="destinations/:id" element={<DestinationDetail />} />
                <Route path="explore-locations" element={<ExploreLocations />} />
                <Route path="locations/:id" element={<LocationDetail />} />
                <Route path="favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="ads/essential/pricing-memberships" element={<MembershipPage />} />
                <Route path="ads/opportunities/partnerships" element={<CommercialPartnerPage />} />
                <Route path="post-advertisement" element={<PostAdvertisement />} />
                <Route path="advertisement-payment" element={
                  <ProtectedRoute>
                    <AdvertisementPayment />
                  </ProtectedRoute>
                } />
                <Route path="renew-advertisement" element={
                  <ProtectedRoute>
                    <RenewAdvertisement />
                  </ProtectedRoute>
                } />
                <Route path="renew-advertisement-payment" element={
                  <ProtectedRoute>
                    <RenewAdvertisementPayment />
                  </ProtectedRoute>
                } />
                <Route path="travel-buddy-form" element={
                  <ProtectedRoute>
                    <TravelBuddyForm />
                  </ProtectedRoute>
                } />
                <Route path="travel-buddies" element={<TravelBuddyPlatform />} />
                <Route path="travel-buddy/:id" element={<TravelBuddyDetail />} />
                <Route path="travel-buddy-favorites" element={
                  <ProtectedRoute>
                    <TravelBuddyFavorites />
                  </ProtectedRoute>
                } />
                <Route path="manage-travel-buddy/:advertisementId" element={
                  <ProtectedRoute>
                    <ManageTravelBuddyProfile />
                  </ProtectedRoute>
                } />
                <Route path="tour-guider-form" element={
                  <ProtectedRoute>
                    <TourGuiderForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-tour-guider/:tourGuiderId" element={
                  <ProtectedRoute>
                    <EditTourGuiderProfile />
                  </ProtectedRoute>
                } />
                <Route path="tour-guider/:tourGuiderId" element={<TourGuiderDetailView />} />
                <Route path="ads/tourism/tour-guiders" element={<ExpertTourGuiders />} />
                <Route path="local-tour-package-form" element={
                  <ProtectedRoute>
                    <LocalTourPackageForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-local-tour-package/:id" element={
                  <ProtectedRoute>
                    <EditLocalTourPackage />
                  </ProtectedRoute>
                } />
                <Route path="local-tour-package/:id" element={<LocalTourPackageDetail />} />
                <Route path="local-tour-packages" element={<LocalTourPackagesBrowse />} />
                <Route path="travel-safe-help-professional-form" element={
                  <ProtectedRoute>
                    <TravelSafeHelpProfessionalForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-travel-safe-help-professional/:id" element={
                  <ProtectedRoute>
                    <EditTravelSafeHelpProfessionalProfile />
                  </ProtectedRoute>
                } />
                <Route path="travel-safe-help-professional/:id" element={<TravelSafeHelpProfessionalDetail />} />
                <Route path="travel-safe-help-professionals" element={<TravelSafeHelpProfessionalsBrowse />} />
                <Route path="ads/tourism/travel-safe" element={<TravelSafeHelpProfessionalsBrowse />} />
                <Route path="rent-land-camping-parking-form" element={
                  <ProtectedRoute>
                    <RentLandCampingParkingForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-rent-land-camping-parking/:id" element={
                  <ProtectedRoute>
                    <EditRentLandCampingParking />
                  </ProtectedRoute>
                } />
                <Route path="rent-land-camping-parking/:id" element={<RentLandCampingParkingDetail />} />
                <Route path="rent-land-camping-parking" element={<RentLandCampingParkingBrowse />} />
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
