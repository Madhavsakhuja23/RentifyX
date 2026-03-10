import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerLayout from './seller/SellerLayout';
import Dashboard from './seller/pages/Dashboard';
import Analytics from './seller/pages/Analytics';
import Messages from './seller/pages/Messages';
import AddDwellings from './seller/pages/AddDwellings';
import AddVehicles from './seller/pages/AddVehicles';
import DriveablesMain from './Saksham/DriveablesMain';
import Dwelling from "./pages/Dwelling";
import ListingDetails from "./pages/ListingDetails";
import RequestToBook from "./pages/RequestToBook";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";
import Profile from "./pages/Profile";
import Chatbot from "./components/dwellings/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/driveables" element={<DriveablesMain />} />
        <Route path="/dwellings" element={<Dwelling />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/book/:id" element={<RequestToBook />} />
        <Route path="/payment" element={<PaymentPage />} />
     
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="add-dwellings" element={<AddDwellings />} />
          <Route path="add-vehicles" element={<AddVehicles />} />
        </Route>
       
      </Routes>
      <Chatbot />
    </Router>
  )
}

export default App;
