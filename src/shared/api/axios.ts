import axios from 'axios';
import { apiConfig } from '@/shared/config';

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

/**
 * Request Interceptor
 * - 토큰 자동 첨부, 요청 데이터 가공 등 공통 로직 처리
 */
apiClient.interceptors.request.use(
  (config) => {
    // FormData는 multipart/form-data + boundary가 필요하므로 기본 json Content-Type을 제거한다.
    if (config.data instanceof FormData) {
      config.headers = config.headers ?? {};
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete config.headers['Content-Type'];
      }
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers ?? {};
      // 요청에 이미 Authorization이 있으면 덮어쓰지 않음 (가입 단계 registrationToken 등)
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * - 응답 데이터 가공, 에러 처리 등 공통 로직 처리
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
