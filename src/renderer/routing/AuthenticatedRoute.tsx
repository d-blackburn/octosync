import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppContextBar } from '../app/AppContextBar';

export interface AuthenticatedRouteProps {
  isAuthenticated: boolean;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  isAuthenticated,
}) => {
  const location = useLocation();

  return isAuthenticated ? (
    <>
      <AppContextBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
export { AuthenticatedRoute };
