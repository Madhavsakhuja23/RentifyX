// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import "./App.css";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import NotFound from "./pages/NotFound";
// import DriveablesMain from "./Saksham/DriveablesMain"; 
// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/driveables" element={<DriveablesMain />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </QueryClientProvider>
//   );
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
import Dwellings from "./pages/Dwellings";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/driveables" element={<DriveablesMain />} />
        <Route path="/dwellings" element={<Dwellings />} />
        
     
        <Route path="/seller" element={<SellerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="messages" element={<Messages />} />
          <Route path="add-dwellings" element={<AddDwellings />} />
          <Route path="add-vehicles" element={<AddVehicles />} />
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App;