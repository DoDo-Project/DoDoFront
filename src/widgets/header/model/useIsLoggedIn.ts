import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { getAccessToken, getRefreshToken } from '@/shared/lib/auth/token';

export function useIsLoggedIn() {
  const location = useLocation();
  return useMemo(
    () => typeof window !== 'undefined' && Boolean(getAccessToken()) && Boolean(getRefreshToken()),
    [location.pathname],
  );
}
