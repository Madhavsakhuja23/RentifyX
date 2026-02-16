<<<<<<< HEAD
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dwellings from "./pages/Dwellings";

function App() {
  return (
    <>
<<<<<<< HEAD
      <div>

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
>>>>>>> 0e4265b (blabla)
  );
}

export default App;
<<<<<<< HEAD
<<<<<<< HEAD
=======
  
>>>>>>> b09cc25 (Landing and Login Page added)
=======
>>>>>>> 0e4265b (blabla)
