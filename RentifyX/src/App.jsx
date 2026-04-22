import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from './seller/context/AuthContext';
import { ListingsProvider } from './seller/context/ListingsContext';
import SellerProtectedRoute from './seller/components/ProtectedRoute';
import DashboardLayout from './seller/components/DashboardLayout';
import DashboardHome from './seller/pages/DashboardHome';
import MyListings from './seller/pages/MyListings';
import AddListing from './seller/pages/AddListing';
import RentalHistory from './seller/pages/RentalHistory';
import RevenueAnalytics from './seller/pages/RevenueAnalytics';
import Notifications from './seller/pages/Notifications';
import ProfileSettings from './seller/pages/ProfileSettings';
import DriveablesMain from './Saksham/DriveablesMain';
import Dwelling from "./pages/dwelling";
import ListingDetails from "./pages/ListingDetails";
import RequestToBook from "./pages/RequestToBook";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";
import Profile from "./pages/Profile";
import Chatbot from "./components/dwellings/Chatbot";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <Router>
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

            {/* Protected Routes — require localStorage token */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
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
              <Route path="profile" element={<ProfileSettings />} />
            </Route>

          </Routes>
          <Chatbot />
        </Router>
      </ListingsProvider>
    </AuthProvider>
  )
}

export default App;

