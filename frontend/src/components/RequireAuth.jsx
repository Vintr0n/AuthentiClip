import { Navigate } from "react-router-dom";
import { useAuth } from './AuthContext';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-4">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
