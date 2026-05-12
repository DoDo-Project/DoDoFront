import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken'));

  if (!hasToken) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
