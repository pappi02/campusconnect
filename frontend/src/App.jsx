import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import VerifyPage from "./pages/VerifyPage";
import IndexPage from "./pages/index";
import HomePage from "./pages/home";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import MyAccountPage from "./pages/MyAccountPage";
import Logout from "./components/MyAccountPage/Logout";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentMethodPage from "./pages/PaymentMethodPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import  AuthProvider  from "./contexts/AuthProvider";
import OrderSuccessPage from './pages/OrderSuccessPage';
import VendorDashboard from "./pages/VendorDashboard";
import VendorDashboardHome from "./pages/VendorDashboardHome";
import VendorOrders from "./pages/VendorOrders";
import VendorProducts from "./pages/VendorProducts";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorCustomers from "./pages/VendorCustomers";
import VendorProfile from "./pages/VendorProfile";
import VendorSettings from "./pages/VendorSettings";
import DeliveryHowItWorks from "./pages/DeliveryHowItWorks";
import DeliveryApplicationForm from "./pages/DeliveryApplicationForm";
import ToastSuccessPage from "./pages/ToastSuccessPage";
import DeliveryLoginPage from "./pages/DeliveryLoginPage";
import AcceptOrderPage from "./pages/AcceptOrderPage";

import DeliveryDashboard from "./pages/DeliveryDashboard";
import AvailableDeliveries from "./pages/AvailableDeliveries";
import DeliveryHistory from "./pages/DeliveryHistory";
import DeliveryEarnings from "./pages/DeliveryEarnings";
import DeliverySchedule from "./pages/DeliverySchedule";
import DeliverySettings from "./pages/DeliverySettings";
import CustomerMapPage from "./pages/CustomerMapPage";


const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer-map" element={<CustomerMapPage />} />
          
          <Route path="/vendorlogin" element={<LoginPage vendorLogin={true} />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/vendor-register" element={<SignUpPage vendorRegister={true} />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/delivery/how-it-works" element={<DeliveryHowItWorks />} />
          <Route path="/delivery/apply" element={<DeliveryApplicationForm />} />
          <Route path="/delivery/login" element={<DeliveryLoginPage />} />
          <Route path="/application-success" element={<ToastSuccessPage />} />
          <Route path="/accept/:orderId" element={<AcceptOrderPage />} />
          <Route element={<PrivateRoute />}>

          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/available" element={<AvailableDeliveries />} />
          <Route path="/delivery/history" element={<DeliveryHistory />} />
          <Route path="/delivery/earnings" element={<DeliveryEarnings />} />
          <Route path="/delivery/schedule" element={<DeliverySchedule />} />
          <Route path="/delivery/settings" element={<DeliverySettings />} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-method" element={<PaymentMethodPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/vendor" element={<VendorDashboard />}>
              <Route index element={<VendorDashboardHome />} />
              <Route path="dashboard" element={<VendorDashboardHome />} />
              
              <Route path="orders" element={<VendorOrders />} />
              <Route path="products" element={<VendorProducts />} />
              <Route path="analytics" element={<VendorAnalytics />} />
              <Route path="customers" element={<VendorCustomers />} />
              <Route path="profile" element={<VendorProfile />} />
              <Route path="setting" element={<VendorSettings />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
