import { apiClient } from '@/shared/api/axios';

import type { UpdateMyProfileRequest, UpdateMyProfileResponse, UserProfile } from '../model/types';

/**
 * 내 정보 조회 (GET /users/me)
 * - accessToken으로 현재 로그인한 사용자 프로필 조회
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/users/me');
  return response.data;
}

/**
 * 내 정보 수정 (PATCH /users/me)
 * - 현재 로그인한 사용자의 닉네임, 지역, 가족 여부를 수정
 */
export async function updateMyProfile(body: UpdateMyProfileRequest): Promise<UpdateMyProfileResponse> {
  const response = await apiClient.patch<UpdateMyProfileResponse>('/users/me', body);
  return response.data;
}
