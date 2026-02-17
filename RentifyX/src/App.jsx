<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dwellings from "./pages/Dwellings";

function App() {
  return (
    <>
<<<<<<< HEAD
      <div>
<<<<<<< HEAD

=======
>>>>>>> 2b03d55 (Explain to saksham git)
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
=======
      <Dwellings />
>>>>>>> cb21056 (dwellings page)
    </>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
<<<<<<< HEAD
=======
import SellerLayout from './seller/SellerLayout';
import Dashboard from './seller/pages/Dashboard';
import Analytics from './seller/pages/Analytics';
import Messages from './seller/pages/Messages';
import AddDwellings from './seller/pages/AddDwellings';
import AddVehicles from './seller/pages/AddVehicles';
import DriveablesMain from './Saksham/DriveablesMain'
import "./App.css";
>>>>>>> 6c708be (seller dashboard)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <Route path="/driveables" element={<DriveablesMain />} />
>>>>>>> a64b7d7 (Replace Driveables component with DriveablesMain)
      </Routes>
    </Router>
>>>>>>> b09cc25 (Landing and Login Page added)
=======
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
=======
        <Route path="/driveables" element={<DriveablesMain />} />
<<<<<<< HEAD
        {/* Seller Routes */}
>>>>>>> 6c708be (seller dashboard)
=======
        {/* Seller Routes for later*/}
>>>>>>> 7e68c29 (some changes in seller)
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="add-dwellings" element={<AddDwellings />} />
          <Route path="add-vehicles" element={<AddVehicles />} />
        </Route>
<<<<<<< HEAD
=======
        
>>>>>>> 6c708be (seller dashboard)
      </Routes>
    </BrowserRouter>
>>>>>>> 0e4265b (blabla)
  );
=======
import DriveablesMain from './Saksham/DriveablesMain'
import './App.css'

function App() {
  return (
    <div className="App">
      <DriveablesMain />
    </div>
  )
>>>>>>> 3f8342c (Driveables landing page)
}

export default App;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  
>>>>>>> b09cc25 (Landing and Login Page added)
=======
>>>>>>> 0e4265b (blabla)
=======
  
>>>>>>> a64b7d7 (Replace Driveables component with DriveablesMain)
