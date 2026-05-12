import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useIsLoggedIn() {
  const location = useLocation();
  return useMemo(
    () => typeof window !== 'undefined' && Boolean(localStorage.getItem('accessToken')),
    [location.pathname],
  );
}
