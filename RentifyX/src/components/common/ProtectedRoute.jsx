import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — Wraps any route that requires authentication.
 * If no valid token exists in localStorage, redirects to /login.
 *
 * Usage in App.jsx:
 *   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token && token !== "undefined" && token !== "null");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
