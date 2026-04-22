import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Dashboard
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyListings from './pages/dashboard/MyListings';
import AddListing from './pages/dashboard/AddListing';
import RentalHistory from './pages/dashboard/RentalHistory';
import RevenueAnalytics from './pages/dashboard/RevenueAnalytics';
import Notifications from './pages/dashboard/Notifications';
import ProfileSettings from './pages/dashboard/ProfileSettings';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="add-listing" element={<AddListing />} />
              <Route path="rental-history" element={<RentalHistory />} />
              <Route path="revenue" element={<RevenueAnalytics />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<ProfileSettings />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ListingsProvider>
    </AuthProvider>
  );
}

export default App;
