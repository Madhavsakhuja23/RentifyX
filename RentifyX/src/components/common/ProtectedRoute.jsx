import { Navigate } from "react-router-dom";
import { useAuth } from "../../seller/context/AuthContext";

/**
 * ProtectedRoute — Wraps any route that requires authentication.
 * Checks the AuthContext for a logged-in user.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
