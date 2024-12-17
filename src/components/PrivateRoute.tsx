import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../states/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  redirectTo?: string; // Optional redirect path
}

const PrivateRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
