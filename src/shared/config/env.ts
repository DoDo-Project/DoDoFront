const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('Missing env: VITE_API_BASE_URL'); // 환경 변수 누락 방지
}

export const env = {
  API_BASE_URL,
};
