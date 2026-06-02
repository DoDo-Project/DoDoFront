// 서버로 요청 넣고, 200/202 라벨 붙여서 응답하는 일 하는 곳
import { apiClient } from '@/shared/api/axios';

import type {
  NicknameCheckResponse,
  NotificationUpdateResponse,
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
  const response = await apiClient.post<SocialLoginSuccess | SocialSignupRequired>(
    '/auth/social-login',
    { provider, code },
    { skipAuthAttach: true, skipAuthRefresh: true },
  );

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

interface CheckNicknameOptions {
  /** 가입 단계에서는 registrationToken을 Authorization 헤더로 전달 */
  authToken?: string;
}

/**
 * 닉네임 중복 확인 (GET /users/nickname/check)
 * - duplicated: false면 사용 가능, true면 이미 사용 중
 */
export async function checkNicknameAvailability(
  nickname: string,
  options?: CheckNicknameOptions,
): Promise<NicknameCheckResponse> {
  const response = await apiClient.get<NicknameCheckResponse>('/users/nickname/check', {
    params: { nickname },
    headers: options?.authToken
      ? {
          Authorization: `Bearer ${options.authToken}`,
        }
      : undefined,
  });

  return response.data;
}

/**
 * 알림 수신 여부 변경 (PATCH /users/me/setting/notification)
 * - 가입 완료 후 accessToken으로 호출 (apiClient 인터셉터)
 */
export async function updateNotificationSetting(notificationEnabled: boolean): Promise<NotificationUpdateResponse> {
  const response = await apiClient.patch<NotificationUpdateResponse>('/users/me/setting/notification', {
    notificationEnabled,
  });

  return response.data;
}
