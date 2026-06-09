import { useSyncExternalStore } from 'react';

import { getAccessToken, subscribeAuthState } from '@/shared/lib/auth/token';

function getLoggedInSnapshot(): boolean {
  return typeof window !== 'undefined' && Boolean(getAccessToken());
}

export function useIsLoggedIn() {
  return useSyncExternalStore(subscribeAuthState, getLoggedInSnapshot, () => false);
}
