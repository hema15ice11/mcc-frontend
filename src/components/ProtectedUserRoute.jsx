import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // optional loading while checking auth

  return user ? children : <Navigate to="/user-login" replace />;
};

export default ProtectedUserRoute;
