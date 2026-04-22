import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const storedUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const finalUser = user || storedUser;

  if (loading && !finalUser) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!finalUser) {
    return <Navigate to="/login" replace />;
  }

  const role = finalUser.role?.trim().toLowerCase();

  if (role !== "owner" && role !== "both") {
    return <Navigate to="/" replace />;
  }

  return children;
}