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
import CafesRestaurantsForm from './pages/CafesRestaurantsForm';
import EditCafesRestaurants from './pages/EditCafesRestaurants';
import CafesRestaurantsDetail from './pages/CafesRestaurantsDetail';
import CafesRestaurantsBrowse from './pages/CafesRestaurantsBrowse';
import FoodsBeveragesForm from './pages/FoodsBeveragesForm';
import EditFoodsBeverages from './pages/EditFoodsBeverages';
import FoodsBeveragesDetail from './pages/FoodsBeveragesDetail';
import FoodsBeveragesBrowse from './pages/FoodsBeveragesBrowse';
import VehicleRentalsHireForm from './pages/VehicleRentalsHireForm';
import EditVehicleRentalsHire from './pages/EditVehicleRentalsHire';
import VehicleRentalsHireDetail from './pages/VehicleRentalsHireDetail';
import VehicleRentalsHireBrowse from './pages/VehicleRentalsHireBrowse';
import ProfessionalDriversForm from './pages/ProfessionalDriversForm';
import EditProfessionalDriversProfile from './pages/EditProfessionalDriversProfile';
import ProfessionalDriversDetailView from './pages/ProfessionalDriversDetailView';
import ProfessionalDriversBrowse from './pages/ProfessionalDriversBrowse';
import VehicleRepairsMechanicsForm from './pages/VehicleRepairsMechanicsForm';
import EditVehicleRepairsMechanicsForm from './pages/EditVehicleRepairsMechanicsForm';
import VehicleRepairsMechanicsDetail from './pages/VehicleRepairsMechanicsDetail';
import VehicleRepairsMechanicsBrowse from './pages/VehicleRepairsMechanicsBrowse';
import EventPlannersCoordinatorsForm from './pages/EventPlannersCoordinatorsForm';
import EventPlannersCoordinatorsBrowse from './pages/EventPlannersCoordinatorsBrowse';
import EventPlannersCoordinatorsDetail from './pages/EventPlannersCoordinatorsDetail';
import EditEventPlannersCoordinatorsForm from './pages/EditEventPlannersCoordinatorsForm';
import CreativePhotographersForm from './pages/CreativePhotographersForm';
import CreativePhotographersDetail from './pages/CreativePhotographersDetail';
import CreativePhotographersBrowse from './pages/CreativePhotographersBrowse';
import EditCreativePhotographersForm from './pages/EditCreativePhotographersForm';
import DecoratorsFloristsForm from './pages/DecoratorsFloristsForm';
import EditDecoratorsFloristsForm from './pages/EditDecoratorsFloristsForm';
import DecoratorsFloristsDetailView from './pages/DecoratorsFloristsDetailView';
import DecoratorsFloristsBrowse from './pages/DecoratorsFloristsBrowse';
import SalonMakeupArtistsForm from './pages/SalonMakeupArtistsForm';
import EditSalonMakeupArtistsForm from './pages/EditSalonMakeupArtistsForm';
import SalonMakeupArtistsDetailView from './pages/SalonMakeupArtistsDetailView';
import SalonMakeupArtistsBrowse from './pages/SalonMakeupArtistsBrowse';
import FashionDesignersForm from './pages/FashionDesignersForm';
import EditFashionDesignersForm from './pages/EditFashionDesignersForm';
import FashionDesignersDetailView from './pages/FashionDesignersDetailView';
import FashionDesignersBrowse from './pages/FashionDesignersBrowse';
import ExpertDoctorsForm from './pages/ExpertDoctorsForm';
import EditExpertDoctorsForm from './pages/EditExpertDoctorsForm';
import ExpertDoctorsDetailView from './pages/ExpertDoctorsDetailView';
import ExpertDoctorsBrowse from './pages/ExpertDoctorsBrowse';
import ProfessionalLawyersForm from './pages/ProfessionalLawyersForm';
import EditProfessionalLawyersProfile from './pages/EditProfessionalLawyersProfile';
import ProfessionalLawyersDetailView from './pages/ProfessionalLawyersDetailView';
import ProfessionalLawyersBrowse from './pages/ProfessionalLawyersBrowse';
import AdvisorsCounselorsForm from './pages/AdvisorsCounselorsForm';
import EditAdvisorsCounselorsProfile from './pages/EditAdvisorsCounselorsProfile';
import AdvisorsCounselorsDetailView from './pages/AdvisorsCounselorsDetailView';
import AdvisorsCounselorsBrowse from './pages/AdvisorsCounselorsBrowse';
import LanguageTranslatorsForm from './pages/LanguageTranslatorsForm';
import EditLanguageTranslatorsForm from './pages/EditLanguageTranslatorsForm';
import LanguageTranslatorsDetailView from './pages/LanguageTranslatorsDetailView';
import LanguageTranslatorsBrowse from './pages/LanguageTranslatorsBrowse';
import ExpertArchitectsForm from './pages/ExpertArchitectsForm';
import EditExpertArchitectsForm from './pages/EditExpertArchitectsForm';
import ExpertArchitectsBrowse from './pages/ExpertArchitectsBrowse';
import ExpertArchitectsDetailView from './pages/ExpertArchitectsDetailView';
import TrustedAstrologistsForm from './pages/TrustedAstrologistsForm';
import EditTrustedAstrologistsForm from './pages/EditTrustedAstrologistsForm';
import TrustedAstrologistsBrowse from './pages/TrustedAstrologistsBrowse';
import TrustedAstrologistsDetailView from './pages/TrustedAstrologistsDetailView';
import DeliveryPartnersForm from './pages/DeliveryPartnersForm';
import EditDeliveryPartnersForm from './pages/EditDeliveryPartnersForm';
import DeliveryPartnersDetailView from './pages/DeliveryPartnersDetailView';
import DeliveryPartnersBrowse from './pages/DeliveryPartnersBrowse';
import GraphicsITTechRepairForm from './pages/GraphicsITTechRepairForm';
import EditGraphicsITTechRepairForm from './pages/EditGraphicsITTechRepairForm';
import GraphicsITTechRepairDetailView from './pages/GraphicsITTechRepairDetailView';
import GraphicsITTechRepairBrowse from './pages/GraphicsITTechRepairBrowse';
import EducationalTutoringForm from './pages/EducationalTutoringForm';
import EditEducationalTutoringForm from './pages/EditEducationalTutoringForm';
import EducationalTutoringBrowse from './pages/EducationalTutoringBrowse';
import EducationalTutoringDetailView from './pages/EducationalTutoringDetailView';
import CurrencyExchangeForm from './pages/CurrencyExchangeForm';
import EditCurrencyExchangeForm from './pages/EditCurrencyExchangeForm';
import CurrencyExchangeDetailView from './pages/CurrencyExchangeDetailView';
import CurrencyExchangeBrowsePage from './pages/CurrencyExchangeBrowsePage';
import OtherProfessionalsServicesForm from './pages/OtherProfessionalsServicesForm';
import EditOtherProfessionalsServicesForm from './pages/EditOtherProfessionalsServicesForm';
import OtherProfessionalsServicesDetailView from './pages/OtherProfessionalsServicesDetailView';
import OtherProfessionalsServicesBrowse from './pages/OtherProfessionalsServicesBrowse';
import BabysittersChildcareForm from './pages/BabysittersChildcareForm';
import EditBabysittersChildcareForm from './pages/EditBabysittersChildcareForm';
import BabysittersChildcareDetailView from './pages/BabysittersChildcareDetailView';
import BabysittersChildcareBrowse from './pages/BabysittersChildcareBrowse';
import PetCareAnimalServicesForm from './pages/PetCareAnimalServicesForm';
import EditPetCareAnimalServicesForm from './pages/EditPetCareAnimalServicesForm';
import PetCareAnimalServicesDetailView from './pages/PetCareAnimalServicesDetailView';
import PetCareAnimalServicesBrowse from './pages/PetCareAnimalServicesBrowse';
import RentPropertyBuyingSellingForm from './pages/RentPropertyBuyingSellingForm';
import EditRentPropertyBuyingSellingForm from './pages/EditRentPropertyBuyingSellingForm';
import RentPropertyBuyingSellingDetailView from './pages/RentPropertyBuyingSellingDetailView';
import RentPropertyBuyingSellingBrowse from './pages/RentPropertyBuyingSellingBrowse';
import ExclusiveGiftPacksForm from './pages/ExclusiveGiftPacksForm';
import EditExclusiveGiftPacksForm from './pages/EditExclusiveGiftPacksForm';
import ExclusiveGiftPacksDetailView from './pages/ExclusiveGiftPacksDetailView';
import ExclusiveGiftPacksBrowse from './pages/ExclusiveGiftPacksBrowse';
import SouvenirsCollectiblesForm from './pages/SouvenirsCollectiblesForm';
import EditSouvenirsCollectiblesForm from './pages/EditSouvenirsCollectiblesForm';
import SouvenirsCollectiblesDetailView from './pages/SouvenirsCollectiblesDetailView';
import SouvenirsCollectiblesBrowse from './pages/SouvenirsCollectiblesBrowse';
import JewelryGemSellersForm from './pages/JewelryGemSellersForm';
import EditJewelryGemSellersForm from './pages/EditJewelryGemSellersForm';
import JewelryGemSellersDetailView from './pages/JewelryGemSellersDetailView';
import JewelryGemSellersBrowse from './pages/JewelryGemSellersBrowse';
import HomeOfficeAccessoriesTechForm from './pages/HomeOfficeAccessoriesTechForm';
import EditHomeOfficeAccessoriesTechForm from './pages/EditHomeOfficeAccessoriesTechForm';
import HomeOfficeAccessoriesTechDetailView from './pages/HomeOfficeAccessoriesTechDetailView';
import HomeOfficeAccessoriesTechBrowse from './pages/HomeOfficeAccessoriesTechBrowse';

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
                <Route path="cafes-restaurants-form" element={
                  <ProtectedRoute>
                    <CafesRestaurantsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-cafes-restaurants/:id" element={
                  <ProtectedRoute>
                    <EditCafesRestaurants />
                  </ProtectedRoute>
                } />
                <Route path="cafes-restaurants/:id" element={<CafesRestaurantsDetail />} />
                <Route path="cafes-restaurants" element={<CafesRestaurantsBrowse />} />
                <Route path="foods-beverages-form" element={
                  <ProtectedRoute>
                    <FoodsBeveragesForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-foods-beverages/:id" element={
                  <ProtectedRoute>
                    <EditFoodsBeverages />
                  </ProtectedRoute>
                } />
                <Route path="foods-beverages/:id" element={<FoodsBeveragesDetail />} />
                <Route path="foods-beverages" element={<FoodsBeveragesBrowse />} />
                <Route path="souvenirs-collectibles-form" element={
                  <ProtectedRoute>
                    <SouvenirsCollectiblesForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-souvenirs-collectibles/:id" element={
                  <ProtectedRoute>
                    <EditSouvenirsCollectiblesForm />
                  </ProtectedRoute>
                } />
                <Route path="souvenirs-collectibles/:id" element={<SouvenirsCollectiblesDetailView />} />
                <Route path="souvenirs-collectibles" element={<SouvenirsCollectiblesBrowse />} />
                <Route path="ads/marketplace/souvenirs" element={<SouvenirsCollectiblesBrowse />} />
                <Route path="vehicle-rentals-hire-form" element={
                  <ProtectedRoute>
                    <VehicleRentalsHireForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-vehicle-rentals-hire/:id" element={
                  <ProtectedRoute>
                    <EditVehicleRentalsHire />
                  </ProtectedRoute>
                } />
                <Route path="vehicle-rentals-hire/:id" element={<VehicleRentalsHireDetail />} />
                <Route path="vehicle-rentals-hire" element={<VehicleRentalsHireBrowse />} />
                <Route path="professional-drivers-form" element={
                  <ProtectedRoute>
                    <ProfessionalDriversForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-professional-drivers/:id" element={
                  <ProtectedRoute>
                    <EditProfessionalDriversProfile />
                  </ProtectedRoute>
                } />
                <Route path="professional-drivers/:id" element={<ProfessionalDriversDetailView />} />
                <Route path="professional-drivers" element={<ProfessionalDriversBrowse />} />
                <Route path="vehicle-repairs-mechanics-form" element={
                  <ProtectedRoute>
                    <VehicleRepairsMechanicsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-vehicle-repairs-mechanics/:id" element={
                  <ProtectedRoute>
                    <EditVehicleRepairsMechanicsForm />
                  </ProtectedRoute>
                } />
                <Route path="vehicle-repairs-mechanics/:id" element={<VehicleRepairsMechanicsDetail />} />
                <Route path="vehicle-repairs-mechanics" element={<VehicleRepairsMechanicsBrowse />} />
                <Route path="event-planners-coordinators-form" element={
                  <ProtectedRoute>
                    <EventPlannersCoordinatorsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-event-planners-coordinators/:id" element={
                  <ProtectedRoute>
                    <EditEventPlannersCoordinatorsForm />
                  </ProtectedRoute>
                } />
                <Route path="event-planners-coordinators/:id" element={<EventPlannersCoordinatorsDetail />} />
                <Route path="event-planners-coordinators" element={<EventPlannersCoordinatorsBrowse />} />
                <Route path="creative-photographers-form" element={
                  <ProtectedRoute>
                    <CreativePhotographersForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-creative-photographers/:id" element={
                  <ProtectedRoute>
                    <EditCreativePhotographersForm />
                  </ProtectedRoute>
                } />
                <Route path="creative-photographers/:id" element={<CreativePhotographersDetail />} />
                <Route path="creative-photographers" element={<CreativePhotographersBrowse />} />
                <Route path="decorators-florists-form" element={
                  <ProtectedRoute>
                    <DecoratorsFloristsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-decorators-florists/:id" element={
                  <ProtectedRoute>
                    <EditDecoratorsFloristsForm />
                  </ProtectedRoute>
                } />
                <Route path="decorators-florists/:id" element={<DecoratorsFloristsDetailView />} />
                <Route path="decorators-florists" element={<DecoratorsFloristsBrowse />} />
                <Route path="salon-makeup-artists-form" element={
                  <ProtectedRoute>
                    <SalonMakeupArtistsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-salon-makeup-artists/:id" element={
                  <ProtectedRoute>
                    <EditSalonMakeupArtistsForm />
                  </ProtectedRoute>
                } />
                <Route path="salon-makeup-artists/:id" element={<SalonMakeupArtistsDetailView />} />
                <Route path="salon-makeup-artists" element={<SalonMakeupArtistsBrowse />} />
                <Route path="fashion-designers-form" element={
                  <ProtectedRoute>
                    <FashionDesignersForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-fashion-designers/:id" element={
                  <ProtectedRoute>
                    <EditFashionDesignersForm />
                  </ProtectedRoute>
                } />
                <Route path="fashion-designers/:id" element={<FashionDesignersDetailView />} />
                <Route path="fashion-designers" element={<FashionDesignersBrowse />} />
                <Route path="expert-doctors-form" element={
                  <ProtectedRoute>
                    <ExpertDoctorsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-expert-doctors/:id" element={
                  <ProtectedRoute>
                    <EditExpertDoctorsForm />
                  </ProtectedRoute>
                } />
                <Route path="expert-doctors/:id" element={<ExpertDoctorsDetailView />} />
                <Route path="expert-doctors" element={<ExpertDoctorsBrowse />} />
                <Route path="professional-lawyers-form" element={
                  <ProtectedRoute>
                    <ProfessionalLawyersForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-professional-lawyers/:id" element={
                  <ProtectedRoute>
                    <EditProfessionalLawyersProfile />
                  </ProtectedRoute>
                } />
                <Route path="professional-lawyers/:id" element={<ProfessionalLawyersDetailView />} />
                <Route path="professional-lawyers" element={<ProfessionalLawyersBrowse />} />
                <Route path="advisors-counselors-form" element={
                  <ProtectedRoute>
                    <AdvisorsCounselorsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-advisors-counselors/:id" element={
                  <ProtectedRoute>
                    <EditAdvisorsCounselorsProfile />
                  </ProtectedRoute>
                } />
                <Route path="advisors-counselors/:id" element={<AdvisorsCounselorsDetailView />} />
                <Route path="advisors-counselors" element={<AdvisorsCounselorsBrowse />} />
                <Route path="language-translators-form" element={
                  <ProtectedRoute>
                    <LanguageTranslatorsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-language-translators/:id" element={
                  <ProtectedRoute>
                    <EditLanguageTranslatorsForm />
                  </ProtectedRoute>
                } />
                <Route path="language-translators/:id" element={<LanguageTranslatorsDetailView />} />
                <Route path="language-translators" element={<LanguageTranslatorsBrowse />} />
                <Route path="expert-architects-form" element={
                  <ProtectedRoute>
                    <ExpertArchitectsForm />
                  </ProtectedRoute>
                } />
                <Route path="expert-architects-edit/:id" element={
                  <ProtectedRoute>
                    <EditExpertArchitectsForm />
                  </ProtectedRoute>
                } />
                <Route path="expert-architects-browse" element={<ExpertArchitectsBrowse />} />
                <Route path="expert-architects/:id" element={<ExpertArchitectsDetailView />} />
                <Route path="trusted-astrologists-form" element={
                  <ProtectedRoute>
                    <TrustedAstrologistsForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-trusted-astrologists/:id" element={
                  <ProtectedRoute>
                    <EditTrustedAstrologistsForm />
                  </ProtectedRoute>
                } />
                <Route path="trusted-astrologists" element={<TrustedAstrologistsBrowse />} />
                <Route path="trusted-astrologists/:id" element={<TrustedAstrologistsDetailView />} />
                <Route path="delivery-partners-form" element={
                  <ProtectedRoute>
                    <DeliveryPartnersForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-delivery-partners/:id" element={
                  <ProtectedRoute>
                    <EditDeliveryPartnersForm />
                  </ProtectedRoute>
                } />
                <Route path="delivery-partners" element={<DeliveryPartnersBrowse />} />
                <Route path="delivery-partners/:id" element={<DeliveryPartnersDetailView />} />
                <Route path="graphics-it-tech-repair-form" element={
                  <ProtectedRoute>
                    <GraphicsITTechRepairForm />
                  </ProtectedRoute>
                } />
                <Route path="graphics-it-tech-repair/:id/edit" element={
                  <ProtectedRoute>
                    <EditGraphicsITTechRepairForm />
                  </ProtectedRoute>
                } />
                <Route path="graphics-it-tech-repair/:id" element={<GraphicsITTechRepairDetailView />} />
                <Route path="graphics-it-tech-repair" element={<GraphicsITTechRepairBrowse />} />
                <Route path="educational-tutoring-form" element={
                  <ProtectedRoute>
                    <EducationalTutoringForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-educational-tutoring/:id" element={
                  <ProtectedRoute>
                    <EditEducationalTutoringForm />
                  </ProtectedRoute>
                } />
                <Route path="educational-tutoring" element={<EducationalTutoringBrowse />} />
                <Route path="educational-tutoring/:id" element={<EducationalTutoringDetailView />} />
                <Route path="currency-exchange-form" element={
                  <ProtectedRoute>
                    <CurrencyExchangeForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-currency-exchange/:id" element={
                  <ProtectedRoute>
                    <EditCurrencyExchangeForm />
                  </ProtectedRoute>
                } />
                <Route path="currency-exchange/:id" element={<CurrencyExchangeDetailView />} />
                <Route path="currency-exchange" element={<CurrencyExchangeBrowsePage />} />
                <Route path="other-professionals-services-form" element={
                  <ProtectedRoute>
                    <OtherProfessionalsServicesForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-other-professionals-services/:id" element={
                  <ProtectedRoute>
                    <EditOtherProfessionalsServicesForm />
                  </ProtectedRoute>
                } />
                <Route path="other-professionals-services/:id" element={<OtherProfessionalsServicesDetailView />} />
                <Route path="other-professionals-services" element={<OtherProfessionalsServicesBrowse />} />
                <Route path="babysitters-childcare-form" element={
                  <ProtectedRoute>
                    <BabysittersChildcareForm />
                  </ProtectedRoute>
                } />
                <Route path="babysitters-childcare-edit/:id" element={
                  <ProtectedRoute>
                    <EditBabysittersChildcareForm />
                  </ProtectedRoute>
                } />
                <Route path="babysitters-childcare-detail/:id" element={<BabysittersChildcareDetailView />} />
                <Route path="babysitters-childcare" element={<BabysittersChildcareBrowse />} />
                <Route path="pet-care-animal-services-form" element={
                  <ProtectedRoute>
                    <PetCareAnimalServicesForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-pet-care-animal-services/:id" element={
                  <ProtectedRoute>
                    <EditPetCareAnimalServicesForm />
                  </ProtectedRoute>
                } />
                <Route path="pet-care-animal-services/:id" element={<PetCareAnimalServicesDetailView />} />
                <Route path="pet-care-animal-services" element={<PetCareAnimalServicesBrowse />} />
                <Route path="rent-property-buying-selling-form" element={
                  <ProtectedRoute>
                    <RentPropertyBuyingSellingForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-rent-property-buying-selling/:id" element={
                  <ProtectedRoute>
                    <EditRentPropertyBuyingSellingForm />
                  </ProtectedRoute>
                } />
                <Route path="rent-property-buying-selling/:id" element={<RentPropertyBuyingSellingDetailView />} />
                <Route path="rent-property-buying-selling" element={<RentPropertyBuyingSellingBrowse />} />
                <Route path="exclusive-gift-packs-form" element={
                  <ProtectedRoute>
                    <ExclusiveGiftPacksForm />
                  </ProtectedRoute>
                } />
                <Route path="edit-exclusive-gift-packs/:id" element={
                  <ProtectedRoute>
                    <EditExclusiveGiftPacksForm />
                  </ProtectedRoute>
                } />
                <Route path="exclusive-gift-packs/:id" element={<ExclusiveGiftPacksDetailView />} />
                <Route path="ads/marketplace/gift-packs" element={<ExclusiveGiftPacksBrowse />} />
                <Route path="jewelry-gem-sellers-form" element={
                  <ProtectedRoute>
                    <JewelryGemSellersForm />
                  </ProtectedRoute>
                } />
                <Route path="jewelry-gem-sellers/:id/edit" element={
                  <ProtectedRoute>
                    <EditJewelryGemSellersForm />
                  </ProtectedRoute>
                } />
                <Route path="jewelry-gem-sellers/:id" element={<JewelryGemSellersDetailView />} />
                <Route path="ads/marketplace/jewelry-gem-sellers" element={<JewelryGemSellersBrowse />} />
                <Route path="home-office-accessories-tech-form" element={
                  <ProtectedRoute>
                    <HomeOfficeAccessoriesTechForm />
                  </ProtectedRoute>
                } />
                <Route path="home-office-accessories-tech/:id/edit" element={
                  <ProtectedRoute>
                    <EditHomeOfficeAccessoriesTechForm />
                  </ProtectedRoute>
                } />
                <Route path="home-office-accessories-tech/:id" element={<HomeOfficeAccessoriesTechDetailView />} />
                <Route path="ads/marketplace/home-office-accessories-tech" element={<HomeOfficeAccessoriesTechBrowse />} />
                {/* Alias routes for sidebar navigation */}
                <Route path="ads/professionals/astrologists" element={<TrustedAstrologistsBrowse />} />
                <Route path="ads/professionals/delivery" element={<DeliveryPartnersBrowse />} />
                <Route path="ads/events/salon-makeup-artists" element={<SalonMakeupArtistsBrowse />} />
                <Route path="ads/events/photographers" element={<CreativePhotographersBrowse />} />
                <Route path="ads/events/fashion-designers" element={<FashionDesignersBrowse />} />
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
