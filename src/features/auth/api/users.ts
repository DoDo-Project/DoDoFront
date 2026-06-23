import { apiClient } from '@/shared/api/axios';

import type {
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  UserProfile,
  WithdrawUserResponse,
  WithdrawalEmailResponse,
} from '../model/types';

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

/**
 * 탈퇴 인증 메일 발송 (POST /users/me/withdrawal/email)
 * - 현재 로그인한 유저 이메일로 인증번호 발송
 * - 1분 이내 재요청 시 429 응답
 */
export async function sendWithdrawalEmail(): Promise<WithdrawalEmailResponse> {
  const response = await apiClient.post<WithdrawalEmailResponse>('/users/me/withdrawal/email');
  return response.data;
}

/**
 * 최종 회원 탈퇴 (DELETE /users/me)
 * - 메일로 받은 6자리 인증번호(authCode)로 계정 삭제
 */
export async function withdrawUser(authCode: string): Promise<WithdrawUserResponse> {
  const response = await apiClient.delete<WithdrawUserResponse>('/users/me', {
    data: { authCode },
  });
  return response.data;
}
