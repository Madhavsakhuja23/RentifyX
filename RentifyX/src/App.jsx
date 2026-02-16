import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SellerLayout from './seller/SellerLayout';
import Dashboard from './seller/pages/Dashboard';
import Analytics from './seller/pages/Analytics';
import Messages from './seller/pages/Messages';
import AddDwellings from './seller/pages/AddDwellings';
import AddVehicles from './seller/pages/AddVehicles';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to seller dashboard */}
        <Route path="/" element={<Navigate to="/seller/dashboard" replace />} />

        {/* Seller Section */}
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="add-dwellings" element={<AddDwellings />} />
          <Route path="add-vehicles" element={<AddVehicles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
