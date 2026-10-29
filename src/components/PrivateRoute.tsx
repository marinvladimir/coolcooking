import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../states/contexts';

interface PrivateRouteProps {
  children: React.ReactElement;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
