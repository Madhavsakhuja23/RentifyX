import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth();

  // Read synchronously from localStorage to avoid React state batching race conditions
  const storedUserStr = localStorage.getItem('currentUser');
  const activeUser = storedUserStr ? JSON.parse(storedUserStr) : null;

  if (loading && !activeUser) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (activeUser.role !== 'owner' && activeUser.role !== 'both') {
    return <Navigate to="/" replace />;
  }

  return children;
}
