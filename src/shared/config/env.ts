const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const OAUTH_REDIRECT_URI = import.meta.env.VITE_OAUTH_REDIRECT_URI;

// 환경 변수 누락 방지
const requiredEnv = {
  VITE_API_BASE_URL: API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
  VITE_NAVER_CLIENT_ID: NAVER_CLIENT_ID,
  VITE_OAUTH_REDIRECT_URI: OAUTH_REDIRECT_URI,
};

Object.entries(requiredEnv).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing env: ${key}`);
  }
});

export const env = {
  API_BASE_URL,
  GOOGLE_CLIENT_ID,
  NAVER_CLIENT_ID,
  OAUTH_REDIRECT_URI,
};
