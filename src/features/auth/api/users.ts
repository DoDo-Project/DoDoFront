import { apiClient } from '@/shared/api/axios';

import type { UserProfile } from '../model/types';

/**
 * 내 정보 조회 (GET /users/me)
 * - accessToken으로 현재 로그인한 사용자 프로필 조회
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/users/me');
  return response.data;
}
