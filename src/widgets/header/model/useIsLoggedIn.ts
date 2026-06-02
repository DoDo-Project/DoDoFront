import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { getAccessToken } from '@/shared/lib/auth/token';

export function useIsLoggedIn() {
  const location = useLocation();
  return useMemo(() => typeof window !== 'undefined' && Boolean(getAccessToken()), [location.pathname]);
}
