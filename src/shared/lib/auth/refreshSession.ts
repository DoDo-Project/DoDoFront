import axios from 'axios';

import { apiConfig } from '@/shared/config';

import { clearTokens, getRefreshToken, setReissueTokens } from './token';

interface ReissueResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

let refreshPromise: Promise<string | null> | null = null;

/** refreshToken으로 accessToken 재발급 (동시 요청은 한 번만 호출) */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await axios.post<ReissueResponse>(
        `${apiConfig.baseURL}/auth/reissue`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: apiConfig.timeout,
        },
      );

      setReissueTokens(response.data);
      return response.data.accessToken;
    } catch (error) {
      console.error('[auth/reissue] 실패', error);
      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  const path = window.location.pathname;
  if (path.startsWith('/auth')) return;
  window.location.assign(`/auth?reason=session-expired&from=${encodeURIComponent(path)}`);
}
