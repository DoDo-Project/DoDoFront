// 서버로 요청 넣고, 200/202 라벨 붙여서 응답하는 일 하는 곳
import { apiClient } from '@/shared/api/axios';

import type {
  RegisterProfileRequest,
  RegisterProfileResponse,
  SocialLoginResult,
  SocialLoginSuccess,
  SocialProvider,
  SocialSignupRequired,
} from '../model/types';

// 회원가입이 더 필요할 때 백엔드가 내려주는 상태 코드
// axios는 2xx를 모두 정상 resolve하므로 200과 202를 status로 구분
const SIGNUP_REQUIRED_STATUS = 202;

/**
 * 소셜 로그인 (POST /auth/social-login)
 * - 200: 기존 회원 → 토큰 발급 (kind: 'LOGIN')
 * - 202: 신규 사용자 → registrationToken 발급, 추가 정보 입력 필요 (kind: 'SIGNUP_REQUIRED')
 */
export async function socialLogin(provider: SocialProvider, code: string): Promise<SocialLoginResult> {
  const response = await apiClient.post<SocialLoginSuccess | SocialSignupRequired>('/auth/social-login', {
    provider,
    code,
  });

  if (response.status === SIGNUP_REQUIRED_STATUS) {
    return { kind: 'SIGNUP_REQUIRED', data: response.data as SocialSignupRequired };
  }

  return { kind: 'LOGIN', data: response.data as SocialLoginSuccess };
}

/**
 * 추가 정보 입력 → 가입 완료 (PUT /users/me/profile)
 * - 202 응답으로 받은 registrationToken을 Authorization 헤더로 전달
 * - 200: 계정 ACTIVE 전환 + 새 토큰 발급
 */
export async function registerProfile(
  body: RegisterProfileRequest,
  registrationToken: string,
): Promise<RegisterProfileResponse> {
  const response = await apiClient.put<RegisterProfileResponse>('/users/me/profile', body, {
    headers: {
      Authorization: `Bearer ${registrationToken}`,
    },
  });

  return response.data;
}
