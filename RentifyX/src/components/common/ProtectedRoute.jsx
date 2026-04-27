import { Navigate } from "react-router-dom";
import { useAuth } from "../../seller/context/AuthContext";

/**
 * ProtectedRoute — Wraps any route that requires authentication.
 * Checks the AuthContext for a logged-in user.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
