import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from './seller/context/AuthContext';
import { ListingsProvider } from './seller/context/ListingsContext';
import { SocketProvider } from './seller/context/SocketContext';
import SellerProtectedRoute from './seller/components/ProtectedRoute';
import DashboardLayout from './seller/components/DashboardLayout';
import DashboardHome from './seller/pages/DashboardHome';
import MyListings from './seller/pages/MyListings';
import AddListing from './seller/pages/AddListing';
import RentalHistory from './seller/pages/RentalHistory';
import RevenueAnalytics from './seller/pages/RevenueAnalytics';
import Notifications from './seller/pages/Notifications';
import ProfileSettings from './seller/pages/ProfileSettings';
import Messages from './seller/pages/Messages';
import DriveablesMain from './Saksham/DriveablesMain';
import Dwelling from "./pages/dwelling";
import Wishlist from "./pages/Wishlist";
import ListingDetails from "./pages/ListingDetails";
import RequestToBook from "./pages/RequestToBook";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";
import Profile from "./pages/Profile";
import Chatbot from "./components/dwellings/Chatbot";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotFound from "./pages/NotFound";
import BuyerMessages from "./pages/BuyerMessages";
import { Toaster } from "react-hot-toast";

/* Info Pages */
import AboutUs from "./pages/info/AboutUs";
import Contact from "./pages/info/Contact";
import HelpCenter from "./pages/info/HelpCenter";
import PrivacyPolicy from "./pages/info/PrivacyPolicy";
import Terms from "./pages/info/Terms";
import FAQ from "./pages/info/FAQ";

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <SocketProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/driveables" element={<DriveablesMain />} />
              <Route path="/dwellings" element={<Dwelling />} />
              <Route path="/listing" element={<Dwelling />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/book/:id" element={<RequestToBook />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* Info Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected Routes — require login */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <BuyerMessages />
                  </ProtectedRoute>
                }
              />

              {/* Seller Routes — require seller AuthContext */}
              <Route
                path="/seller"
                element={
                  <SellerProtectedRoute>
                    <DashboardLayout />
                  </SellerProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="listings" element={<MyListings />} />
                <Route path="add-listing" element={<AddListing />} />
                <Route path="history" element={<RentalHistory />} />
                <Route path="analytics" element={<RevenueAnalytics />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<ProfileSettings />} />
              </Route>

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFound />} />

            </Routes>
            <Chatbot />
          </Router>
        </SocketProvider>
      </ListingsProvider>
    </AuthProvider>
  )
}

export default App;
