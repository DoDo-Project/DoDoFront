import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { clearTokens, getAccessToken } from '@/shared/lib/auth/token';

type RequireAuthProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const hasAccess = typeof window !== 'undefined' && Boolean(getAccessToken());

  if (!hasAccess) {
    clearTokens();
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
