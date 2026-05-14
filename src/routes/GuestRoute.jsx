import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
  const { user } = useAuth();
  if (!user) return <Outlet />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'seller') return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
};

export default GuestRoute;
