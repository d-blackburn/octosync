import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export interface AuthenticatedRouteProps {
  isAuthenticated: boolean;
}

const UnauthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  isAuthenticated,
}) => {
  const location = useLocation();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/-/" replace state={{ from: location }} />
  );
};
export { UnauthenticatedRoute };
