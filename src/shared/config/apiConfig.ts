import { env } from './env';

export const apiConfig = {
  baseURL: env.API_BASE_URL,
  timeout: 10_000, // 10초
};
