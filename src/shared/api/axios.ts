import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { apiConfig } from '@/shared/config';
import { refreshAccessToken, redirectToLogin } from '@/shared/lib/auth/refreshSession';
import { getAccessToken, isAccessTokenExpired } from '@/shared/lib/auth/token';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** true면 Authorization 미첨부·선제 reissue 생략 (소셜 로그인 등) */
    skipAuthAttach?: boolean;
    /** true면 401 시 재발급·재시도를 하지 않음 */
    skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

function isPublicAuthPath(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes('/auth/social-login') || url.includes('/auth/reissue');
}

/**
 * 공통 Axios 인스턴스
 * - 기본 설정 한 번에 관리(baseURL, timeout, headers 등)
 */
export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function attachAccessToken(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const url = config.url ?? '';

  if (config.skipAuthAttach || isPublicAuthPath(url)) {
    if (config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Authorization');
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  }

  if (config.headers?.Authorization) {
    return config;
  }

  let token = getAccessToken();

  if (token && isAccessTokenExpired() && !config.skipAuthRefresh) {
    const refreshed = await refreshAccessToken();
    token = refreshed ?? getAccessToken();
  }

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * Request Interceptor
 * - 토큰 자동 첨부, 만료 임박 시 선제 reissue, FormData Content-Type 처리
 */
apiClient.interceptors.request.use(
  async (config) => {
    if (config.data instanceof FormData) {
      config.headers = config.headers ?? {};
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }

    return attachAccessToken(config);
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * - 401 시 refresh 후 원 요청 1회 재시도
 * - reissue 실패 시 로그아웃 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      originalRequest._retry ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newToken = await refreshAccessToken();
    if (!newToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newToken}`;

    return apiClient(originalRequest);
  },
);
